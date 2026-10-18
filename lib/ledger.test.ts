import {describe,it,expect} from 'vitest';
import {sha256,merkleRoot,merkleProof,verifyMerkleProof,makeBlock,validatePurchase,verifyChain,hashTransaction,verifyTxHash,type LedgerTx} from './ledger';

describe('educational ledger cryptography',()=>{
  it('calculates stable SHA-256 hashes',async()=>{
    expect(await sha256('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(await sha256('abc')).toBe(await sha256('abc'));
    expect(await sha256('abd')).not.toBe(await sha256('abc'));
  });

  it('calculates and verifies Merkle inclusion proofs, including odd leaf counts',async()=>{
    const leaves=await Promise.all(['a','b','c'].map(sha256));
    const root=await merkleRoot(leaves);
    const proof=await merkleProof(leaves,2);
    expect(await verifyMerkleProof(leaves[2],proof,root)).toBe(true);
    expect(await verifyMerkleProof(await sha256('tampered'),proof,root)).toBe(false);
    await expect(merkleProof(leaves,-1)).rejects.toThrow('Invalid leaf index');
    await expect(merkleProof(leaves,leaves.length)).rejects.toThrow('Invalid leaf index');
  });

  it('links consecutive blocks and rejects gaps or broken previous-hash links',async()=>{
    const first=await makeBlock(1,'0'.repeat(64),[]);
    const second=await makeBlock(2,first.hash,[]);
    expect(second.previousHash).toBe(first.hash);
    expect(await verifyChain([first,second])).toBe(true);
    expect(await verifyChain([first,{...second,number:3}])).toBe(false);
    expect(await verifyChain([first,{...second,previousHash:'f'.repeat(64)}])).toBe(false);
  });

  it('detects changes to transaction contents after they were hashed',async()=>{
    const timestamp='2026-10-14T12:00:00.000Z';
    const tx:LedgerTx={id:'TX-0001',hash:'',productId:'DM-001',product:'Headphones',buyer:'buyer',seller:'seller',amount:0.18,timestamp,block:1,status:'Confirmed',mode:'EDUCATIONAL DEMO'};
    tx.hash=await hashTransaction(tx);
    const block=await makeBlock(1,'0'.repeat(64),[tx]);
    expect(await verifyChain([block])).toBe(true);
    expect(await verifyChain([{...block,transactions:[{...tx,amount:0.19}]}])).toBe(false);
  });

  it('validates purchase availability, identity, and safe integer balances',()=>{
    expect(validatePurchase({available:true,seller:'s',buyer:'b',priceCents:200,balanceCents:200})).toBe(true);
    expect(()=>validatePurchase({available:false,seller:'s',buyer:'b',priceCents:2,balanceCents:3})).toThrow();
    expect(()=>validatePurchase({available:true,seller:'a',buyer:'a',priceCents:2,balanceCents:3})).toThrow();
    expect(()=>validatePurchase({available:true,seller:'s',buyer:'b',priceCents:3,balanceCents:2})).toThrow();
  });

  it('verifies transaction payload hash authenticity',async()=>{
    const timestamp='2026-10-18T12:00:00.000Z';
    const tx:LedgerTx={id:'TX-0002',hash:'',productId:'DM-002',product:'Keyboard',buyer:'0xBuyer',seller:'0xSeller',amount:0.24,timestamp,block:1,status:'Confirmed',mode:'EDUCATIONAL DEMO'};
    tx.hash=await hashTransaction(tx);
    expect(await verifyTxHash(tx)).toBe(true);
    expect(await verifyTxHash({...tx,hash:'badhash'})).toBe(false);
  });
});
