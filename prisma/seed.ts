import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const users = [
  { id: 'demo-maya', name: 'Maya Chen', address: '0x71C7000000000000000000000000000000009A42' },
  { id: 'demo-alex', name: 'Alex Rivera', address: '0x39b8000000000000000000000000000000001D06' },
  { id: 'demo-sam', name: 'Sam Okafor', address: '0xA1f20000000000000000000000000000000080Ce' },
];
const products = [
  ['DM-001','Wireless Headphones','Studio tuned sound with comfortable all-day fit.','Electronics','180000000000000000','demo-alex'],
  ['DM-002','Mechanical Keyboard','Compact tactile keyboard with hot-swap switches.','Electronics','240000000000000000','demo-sam'],
  ['DM-003','Gaming Mouse','Lightweight precision mouse with programmable controls.','Electronics','110000000000000000','demo-alex'],
  ['DM-004','Smartwatch','A minimal daily companion with health tracking.','Electronics','320000000000000000','demo-sam'],
  ['DM-005','Pixel Garden #08','Original generative artwork from the Pixel Garden collection.','Digital Art','420000000000000000','demo-maya'],
  ['DM-006','Solidity Starter Course','A practical introduction to contracts and the EVM.','Learning','280000000000000000','demo-alex'],
  ['DM-007','Aluminium Laptop Stand','An adjustable desk stand made for better posture.','Accessories','90000000000000000','demo-sam'],
  ['DM-008','Blockchain Field Guide','A concise ebook on ledgers, consensus, and cryptography.','Learning','60000000000000000','demo-maya'],
] as const;
async function main() {
  for (const user of users) {
    await prisma.user.upsert({ where: { id: user.id }, update: { name: user.name }, create: { id: user.id, name: user.name } });
    await prisma.wallet.upsert({ where: { address: user.address }, update: { userId: user.id }, create: { address: user.address, userId: user.id } });
  }
  for (const [id,name,description,category,priceWei,sellerId] of products) {
    await prisma.product.upsert({ where: { id }, update: { name, description, category, priceWei, sellerId }, create: { id, name, description, category, priceWei, sellerId } });
  }
  console.log('Seeded three demo users, wallets, and eight products.');
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
