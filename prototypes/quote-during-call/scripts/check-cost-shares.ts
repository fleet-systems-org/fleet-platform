import assert from 'node:assert/strict';
import { shareTenths, shareText, vehicleCosts } from '../src/app/cost-shares';
import { cents } from '../src/app/model';
assert.deepEqual(['18.00', '10.00', '6.00', '4.00', '0.18', '0.00'].map(value => shareText(shareTenths(value, '38.18'))), ['47,1', '26,2', '15,7', '10,5', '0,5', '0,0']);
assert.equal(vehicleCosts.reduce((sum, row) => sum + cents(row.value), 0n), 600n);
assert.equal(vehicleCosts.length, 9);
assert.equal(shareTenths('0.00', '0.00'), 0n);
assert.equal(shareText(shareTenths('1.00', '3.00')), '33,3');
assert.equal(shareTenths('9007199254740993.00', '18014398509481986.00'), 500n);
assert.equal(shareTenths('0.01', '0.16'), 63n);
console.log('Cost shares: fixture, vehicle sum, zero, rounding and large BigInt assertions passed.');

const countryShares = ['2.40', '1.60', '15.00', '9.00'].map(value => shareTenths(value, '28.00'));
assert.deepEqual(countryShares.map(shareText), ['8,6', '5,7', '53,6', '32,1']);
assert.equal(shareText(countryShares.reduce((sum, share) => sum + share, 0n)), '100,0');
assert.equal(shareText(shareTenths('28.00', '28.00')), '100,0');
console.log('Country shares: 8,6 / 5,7 / 53,6 / 32,1; sum 100,0 passed.');
