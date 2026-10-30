#!/usr/bin/env python3
"""Generate decorative Europe land, roads and fictional routes.

N8a reference geometry; Natural Earth public-domain input.
Download ne_50m_land.geojson and ne_10m_roads.geojson from
https://github.com/nvkelso/natural-earth-vector/tree/master/geojson
to an external cache, then run with --dane <cache-directory>.
Uses only the Python standard library. No private data or animation.
"""
import heapq
import json
import math
import os
import sys

TU = os.path.dirname(os.path.abspath(__file__))
WYNIK = os.path.join(TU, "..", "src", "app", "europe-map.ts")
LON, LAT = (-11.0, 34.0), (35.0, 60.5)          # wycinek: Portugalia … Wilno/Mińsk, Sycylia … Sztokholm
SZER = 1000.0
UPROSZCZ_LAD, UPROSZCZ_DROGI, UPROSZCZ_TRASY = 0.9, 1.4, 0.5

# Fikcyjne trasy (punkty po drodze). Kolejność = kierunek jazdy kropki.
MIASTA = {
    "Lublin": (22.57, 51.25), "Warszawa": (21.01, 52.23), "Poznań": (16.93, 52.41), "Berlin": (13.40, 52.52),
    "Hamburg": (9.99, 53.55), "Kraków": (19.94, 50.06), "Katowice": (19.02, 50.26), "Praga": (14.42, 50.08),
    "Sokolov": (12.65, 50.18), "Norymberga": (11.08, 49.45), "Wrocław": (17.04, 51.11), "Drezno": (13.74, 51.05),
    "Gdańsk": (18.65, 54.35), "Łódź": (19.46, 51.76), "Wiedeń": (16.37, 48.21), "Monachium": (11.58, 48.14),
    "Amsterdam": (4.90, 52.37), "Bruksela": (4.35, 50.85), "Paryż": (2.35, 48.86), "Mediolan": (9.19, 45.46),
    "Budapeszt": (19.04, 47.50), "Wilno": (25.28, 54.69), "Lyon": (4.84, 45.76), "Madryt": (-3.70, 40.42),
    "Barcelona": (2.17, 41.39), "Kopenhaga": (12.57, 55.68), "Frankfurt": (8.68, 50.11), "Ostrawa": (18.29, 49.82),
    "Brno": (16.61, 49.20),
}
# Sieć tras (spotykają się w miastach-węzłach i tworzą pętle). Kolejność = kierunek białych świateł.
MIASTA_TRAS = [
    ["Wilno", "Warszawa", "Poznań", "Berlin", "Hamburg", "Kopenhaga"],
    ["Lublin", "Warszawa", "Łódź", "Wrocław", "Drezno", "Praga", "Brno", "Wiedeń", "Budapeszt"],
    ["Gdańsk", "Łódź", "Katowice", "Kraków"],
    ["Kraków", "Katowice", "Ostrawa", "Brno"],
    ["Wiedeń", "Monachium", "Mediolan"],
    ["Berlin", "Drezno", "Praga", "Sokolov", "Norymberga", "Frankfurt", "Bruksela", "Paryż"],
    ["Hamburg", "Amsterdam", "Bruksela"],
    ["Norymberga", "Monachium"],
    ["Berlin", "Frankfurt"],
    ["Paryż", "Lyon", "Mediolan"],
    ["Lyon", "Barcelona", "Madryt"],
    ["Poznań", "Wrocław"],
]
PAS = 2.6                          # odległość smugi od osi drogi (j. viewBox): dwa pasy światła jak na zdjęciu nocą


# ------------------------------------------------------------------ rzut i geometria

def _merc_y(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


_X0, _X1 = math.radians(LON[0]), math.radians(LON[1])
_Y0, _Y1 = _merc_y(LAT[1]), _merc_y(LAT[0])
_SKALA = SZER / (_X1 - _X0)
WYS = round((_Y0 - _Y1) * _SKALA, 1)


def rzut(lon, lat):
    """Web Mercator → współrzędne viewBox (0..SZER, 0..WYS)."""
    return ((math.radians(lon) - _X0) * _SKALA, (_Y0 - _merc_y(lat)) * _SKALA)


def uprosc(pkt, tol):
    """Douglas–Peucker (iteracyjnie)."""
    if len(pkt) < 3:
        return pkt
    zostaw = [False] * len(pkt)
    zostaw[0] = zostaw[-1] = True
    stos = [(0, len(pkt) - 1)]
    while stos:
        a, b = stos.pop()
        (ax, ay), (bx, by) = pkt[a], pkt[b]
        dx, dy = bx - ax, by - ay
        dl = math.hypot(dx, dy)
        naj, idx = -1.0, None
        for i in range(a + 1, b):
            px, py = pkt[i]            # pierścień zamknięty (początek = koniec): odległość od punktu, nie od prostej
            d = abs(dy * px - dx * py + bx * ay - by * ax) / dl if dl > 1e-9 else math.hypot(px - ax, py - ay)
            if d > naj:
                naj, idx = d, i
        if idx is not None and naj > tol:
            zostaw[idx] = True
            stos += [(a, idx), (idx, b)]
    return [p for p, z in zip(pkt, zostaw) if z]


def przytnij_wielokat(pkt, x0, y0, x1, y1):
    """Sutherland–Hodgman do prostokąta."""
    def tnij(pkt, wewn, przec):
        out = []
        for i, b in enumerate(pkt):
            a = pkt[i - 1]
            if wewn(b):
                if not wewn(a):
                    out.append(przec(a, b))
                out.append(b)
            elif wewn(a):
                out.append(przec(a, b))
        return out

    def px(x):
        return lambda a, b: (x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]))

    def py(y):
        return lambda a, b: (a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y)
    for wewn, przec in ((lambda p: p[0] >= x0, px(x0)), (lambda p: p[0] <= x1, px(x1)),
                        (lambda p: p[1] >= y0, py(y0)), (lambda p: p[1] <= y1, py(y1))):
        if not pkt:
            break
        pkt = tnij(pkt, wewn, przec)
    return pkt


def _w_ramce(p, m=0.0):
    return -m <= p[0] <= SZER + m and -m <= p[1] <= WYS + m


def sciezka(linie, zamknij=False):
    czesci = []
    for pkt in linie:
        if len(pkt) < 2:
            continue
        s = "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pkt)
        czesci.append(s + ("Z" if zamknij else ""))
    return "".join(czesci)


# ------------------------------------------------------------------ dane

def lad(sciezka_pliku):
    linie = []
    for f in json.load(open(sciezka_pliku, encoding="utf-8"))["features"]:
        g = f["geometry"]
        wielokaty = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        for w in wielokaty:
            for pierscien in w:
                pkt = przytnij_wielokat([rzut(x, y) for x, y in pierscien], -2, -2, SZER + 2, WYS + 2)
                pkt = uprosc(pkt, UPROSZCZ_LAD)
                if len(pkt) >= 3 and _pole(pkt) > 4:
                    linie.append(pkt)
    return linie


def _pole(pkt):
    return abs(sum(a[0] * b[1] - b[0] * a[1] for a, b in zip(pkt, pkt[1:] + pkt[:1]))) / 2


def drogi(sciezka_pliku):
    """(linie tła = posklejana sieć autostrad i ekspresowych, graf do tras = wszystkie drogi bez promów)."""
    tlo, graf = {}, {}
    for f in json.load(open(sciezka_pliku, encoding="utf-8"))["features"]:
        typ = f["properties"].get("type") or ""
        if "Ferry" in typ:
            continue
        g = f["geometry"]
        for linia in ([g["coordinates"]] if g["type"] == "LineString" else g["coordinates"]):
            if not any(LON[0] - 3 < x < LON[1] + 3 and LAT[0] - 2 < y < LAT[1] + 2 for x, y in linia):
                continue
            for a, b in zip(linia, linia[1:]):
                ka, kb = _klucz(a), _klucz(b)
                if ka != kb:
                    graf.setdefault(ka, {})[kb] = _waga(ka, kb)
                    graf.setdefault(kb, {})[ka] = _waga(ka, kb)
            if typ in ("Major Highway", "Secondary Highway"):
                for a, b in zip(linia, linia[1:]):
                    ka, kb = _klucz(a), _klucz(b)
                    if ka != kb:
                        tlo.setdefault(ka, {})[kb] = tlo.setdefault(kb, {})[ka] = _waga(ka, kb)
    _sklej_konce(graf)
    _sklej_konce(tlo)
    return [uprosc([rzut(*_lonlat(k)) for k in l], UPROSZCZ_DROGI) for l in lancuchy(tlo)], _najwiekszy_kawalek(graf)


def lancuchy(graf):
    """Graf → linie ciągłe (łańcuchy między węzłami o stopniu ≠ 2), każda krawędź raz — sieć bez przerw."""
    uzyte, out = set(), []

    def idz(a, b):
        linia = [a, b]
        uzyte.add(frozenset((a, b)))
        while len(graf[b]) == 2:
            wolne = [v for v in graf[b] if frozenset((b, v)) not in uzyte]
            if not wolne:
                break
            nast = wolne[0]
            uzyte.add(frozenset((b, nast)))
            a, b = b, nast
            linia.append(b)
        return linia
    for u in graf:
        if len(graf[u]) != 2:
            for v in graf[u]:
                if frozenset((u, v)) not in uzyte:
                    out.append(idz(u, v))
    for u in graf:                                          # pętle bez węzłów rozgałęzień
        for v in graf[u]:
            if frozenset((u, v)) not in uzyte:
                out.append(idz(u, v))
    return [l for l in out if any(_w_ramce(rzut(*_lonlat(k)), 20) for k in l)]


SIATKA, MOST = 0.05, 2            # sklejanie końców (Natural Earth ma przerwy na skrzyżowaniach): 0,05° ≈ 5 km


def _klucz(p):
    return (round(p[0] / SIATKA), round(p[1] / SIATKA))


def _lonlat(k):
    return (k[0] * SIATKA, k[1] * SIATKA)


def _waga(a, b):
    (x1, y1), (x2, y2) = _lonlat(a), _lonlat(b)
    return math.hypot((x1 - x2) * math.cos(math.radians(y1)), y1 - y2)


def _sklej_konce(graf):
    """Wiszący koniec drogi łączy się z najbliższym węzłem w promieniu MOST oczek siatki."""
    kom = {}
    for k in graf:
        kom.setdefault((k[0] // MOST, k[1] // MOST), []).append(k)
    for k in [k for k, v in graf.items() if len(v) == 1]:
        kand = [c for dx in (-1, 0, 1) for dy in (-1, 0, 1) for c in kom.get((k[0] // MOST + dx, k[1] // MOST + dy), [])
                if c != k and c not in graf[k] and (c[0] - k[0]) ** 2 + (c[1] - k[1]) ** 2 <= MOST * MOST]
        if kand:
            c = min(kand, key=lambda c: (c[0] - k[0]) ** 2 + (c[1] - k[1]) ** 2)
            graf[k][c] = graf[c][k] = _waga(k, c)


def _najwiekszy_kawalek(graf):
    """Tylko największy spójny kawałek sieci — w nim każda para miast ma połączenie."""
    widziane, najw = set(), set()
    for s in graf:
        if s in widziane:
            continue
        kaw, stos = {s}, [s]
        while stos:
            for v in graf[stos.pop()]:
                if v not in kaw:
                    kaw.add(v)
                    stos.append(v)
        widziane |= kaw
        najw = max(najw, kaw, key=len)
    return {k: {v: w for v, w in graf[k].items() if v in najw} for k in najw}


def najblizszy(graf, lon, lat):
    k = _klucz((lon, lat))
    return min(graf, key=lambda c: (c[0] - k[0]) ** 2 + (c[1] - k[1]) ** 2)


def dijkstra(graf, a, b):
    odl, skad, kol = {a: 0.0}, {}, [(0.0, a)]
    while kol:
        d, u = heapq.heappop(kol)
        if u == b:
            break
        if d > odl.get(u, 1e18):
            continue
        for v, w in graf[u].items():
            if d + w < odl.get(v, 1e18):
                odl[v], skad[v] = d + w, u
                heapq.heappush(kol, (d + w, v))
    if b not in odl:
        return None
    droga = [b]
    while droga[-1] != a:
        droga.append(skad[droga[-1]])
    return droga[::-1]


def rownolegla(pkt, d):
    """Linia przesunięta o d w bok (w prawo względem kierunku jazdy), fazowanie na ostrych zakrętach."""
    out = []
    for i, (x, y) in enumerate(pkt):
        nx = ny = 0.0
        for j in (i - 1, i):
            if 0 <= j and j + 1 < len(pkt):
                (ax, ay), (bx, by) = pkt[j], pkt[j + 1]
                dl = math.hypot(bx - ax, by - ay) or 1
                nx, ny = nx - (by - ay) / dl, ny + (bx - ax) / dl
        n = math.hypot(nx, ny) or 1
        out.append((x + nx / n * d, y + ny / n * d))
    return out


def main(argv):
    dane = argv[argv.index("--dane") + 1] if "--dane" in argv else "/tmp/ne"
    linie_ladu = lad(os.path.join(dane, "ne_50m_land.geojson"))
    tlo, graf = drogi(os.path.join(dane, "ne_10m_roads.geojson"))
    trasy = []
    for nr, miasta in enumerate(MIASTA_TRAS, 1):
        wezly = [najblizszy(graf, *MIASTA[m]) for m in miasta]
        cala = []
        for a, b in zip(wezly, wezly[1:]):
            odc = dijkstra(graf, a, b)
            if odc is None:
                print(f"trasa {nr}: brak połączenia {a} → {b} — pomijam odcinek", file=sys.stderr)
                continue
            cala += odc if not cala else odc[1:]
        pkt = uprosc([rzut(*_lonlat(k)) for k in cala], UPROSZCZ_TRASY)
        dl = sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pkt, pkt[1:]))
        trasy.append({"id": f"trasa-{nr}", "d": sciezka([pkt]), "dl": round(dl),
                      "przod": sciezka([rownolegla(pkt, PAS)]), "tyl": sciezka([rownolegla(pkt, -PAS)])})
        print(f"trasa {nr} ({' → '.join(miasta)}): {len(pkt)} pkt, {dl:.0f} j.")
    miasta = sorted({m for t in MIASTA_TRAS for m in t})
    wynik = {"szer": SZER, "wys": WYS, "lad": sciezka(linie_ladu, zamknij=True), "drogi": sciezka(tlo),
             "trasy": trasy, "miasta": [[round(c, 1) for c in rzut(*MIASTA[m])] for m in miasta]}
    with open(WYNIK, "w", encoding="utf-8") as f:
        f.write("// Generated by scripts/generate-europe-map.py; do not edit.\n"
                "// Natural Earth ne_50m_land + ne_10m_roads, public domain. Routes are fictional.\n// Source: https://github.com/nvkelso/natural-earth-vector/tree/master/geojson\n// License: https://www.naturalearthdata.com/about/terms-of-use/\n"
                f"export const MAPA = {json.dumps(wynik, ensure_ascii=False)} as const;\n")
    print(f"zapisano {os.path.normpath(WYNIK)}: {os.path.getsize(WYNIK) / 1024:.0f} KB "
          f"(ląd {len(linie_ladu)} wielokątów, drogi {len(tlo)} linii, graf {len(graf)} węzłów)")


if __name__ == "__main__":
    sys.exit(main(sys.argv))
