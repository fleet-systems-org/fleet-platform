import { useRef, useState } from "react";
import { Card, CardTitle } from "@fleet-platform/ui/components/card";
import { Button } from "@fleet-platform/ui/components/button";
import { Badge } from "@fleet-platform/ui/components/badge";
import { Field } from "@fleet-platform/ui/components/field";
import { Textarea } from "@fleet-platform/ui/components/textarea";
import { Alert } from "@fleet-platform/ui/components/alert";
import { SuccessMessage } from "@fleet-platform/ui/backend/feedback/SuccessMessage";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@fleet-platform/ui/components/alert-dialog";

type Action = "correct" | "cancel";

// s18: correction and cancellation of the accepted K2 (R12, Revision lifecycle). One reason, one confirmation; evidence stays.
export function Correction({ stateId, accepted, cancelled, onDone }: { stateId: string; accepted: boolean; cancelled: boolean; onDone: (action: Action) => void }) {
  const [action, setAction] = useState<Action | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const trigger = useRef<HTMLButtonElement | null>(null);
  if (!accepted) return <div className="stack"><h1 className="text-page-title">Korekta i anulowanie kursu</h1>
    <Alert variant="neutral" title="Uwaga · Najpierw przyjmij kurs" action={<Button variant="secondary" asChild><a href="#s16">Przyjęcie kursu</a></Button>}>Korekta i anulowanie dotyczą tylko przyjętego kursu. W symulacji przyjmij K2.</Alert></div>;
  const open = (next: Action, button: HTMLButtonElement) => { trigger.current = button; setAction(next); setError(""); setDone(""); };
  return <div className="stack"><h1 className="text-page-title">Korekta i anulowanie · K2 <Badge variant="neutral">{cancelled ? "Anulowany" : "Przyjęty"}</Badge></h1>
    <Card><CardTitle>Przyjęty kurs K2</CardTitle>
      <p>Kierowca A · DEMO 001 · Miejsce B → Miejsce C · 12.11.2026, 12:00–13:00 (Warszawa).</p>
      {done && <SuccessMessage>{done}</SuccessMessage>}
      {!cancelled && <div className="actions">
        <Button variant="secondary" onClick={event => open("correct", event.currentTarget)}>Koryguj kurs</Button>
        <Button variant="secondary" onClick={event => open("cancel", event.currentTarget)}>Anuluj kurs</Button></div>}
      <p className="text-meta">Korekta tworzy nową propozycję od przyjętej wersji. Anulowany kurs zostaje w historii z dowodami. Nieprzyjęte następniki stają się nieaktualne, przyjęte dostają flagę przeglądu. Symulacja.</p>
    </Card>
    <AlertDialog open={action !== null} onOpenChange={value => { if (!value) setAction(null); }}>
      <AlertDialogContent onCloseAutoFocus={event => { event.preventDefault(); trigger.current?.focus(); }}>
        <AlertDialogHeader><AlertDialogTitle>{action === "cancel" ? "Anulować kurs K2?" : "Skorygować kurs K2?"}</AlertDialogTitle>
          <AlertDialogDescription>{action === "cancel" ? "Kurs zostanie w historii z dowodami; jego odcinki staną się nieprzypisane i do przeglądu." : "Powstanie nowa propozycja od przyjętej wersji K2; obecna zostaje w historii."} K3 stanie się nieaktualny.</AlertDialogDescription></AlertDialogHeader>
        <Field label="Powód" required hint="Krótko, bez nazwisk i danych osobowych. Do 500 znaków." error={error || undefined}><Textarea value={reason} maxLength={500} onChange={event => { setReason(event.target.value); setError(""); }}/></Field>
        <AlertDialogFooter><AlertDialogCancel>Wróć</AlertDialogCancel><AlertDialogAction onClick={event => {
          if (!reason.trim()) { event.preventDefault(); setError("Wpisz powód."); return; }
          // s18.5: version conflict; the reason stays in the dialog.
          if (stateId === "s18.5") { event.preventDefault(); setError("Kurs zmienił się w międzyczasie. Powód został; sprawdź kurs i potwierdź ponownie."); return; }
          const current = action!;
          setDone(stateId === "s18.6" ? "Ponowienie rozpoznane: to ta sama zmiana, zapisana raz." : current === "cancel" ? "Kurs K2 anulowany w symulacji. K3 nieaktualny." : "Korekta zapisana w symulacji jako nowa propozycja. K3 nieaktualny.");
          setReason(""); onDone(current);
        }}>{action === "cancel" ? "Anuluj kurs" : "Zapisz korektę"}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
}
