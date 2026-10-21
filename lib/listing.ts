export type ListingDraft = { name: string; price: number };

export function validateListingDraft(nameInput: string, priceInput: string): ListingDraft {
  const name = nameInput.trim();
  const price = Number(priceInput);

  if (!name) throw new Error('Enter a product name.');
  if (name.length > 80) throw new Error('Product names must be 80 characters or fewer.');
  if (!priceInput.trim() || !Number.isFinite(price) || price <= 0) {
    throw new Error('Enter a valid price above zero.');
  }

  return { name, price };
}
