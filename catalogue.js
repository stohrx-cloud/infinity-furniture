/* Home page data, from infinityfurniture.ca (prices as listed 2026-11-12).
   Ids are the store's own product ids, so a piece added here is the same piece in the shop.
   tr = described by the store as made in Turkey. x = highest option in the collection. */
const U = (slug) => `https://infinityfurniture.ca/product/${slug}/`;

/* The collections list. */
window.COLLECTIONS = [
  { group: 'Living', items: [
    { id: 14211, n: 'Galaxy', w: 'Sectional, sofa and chair', q: 'Deep seats on a wooden plinth, in a soft textured weave.', p: 1399, x: 5399, t: 'assets/t/galaxy-corner.webp', u: U('galaxy-modern-living-room-collection-concept') },
    { id: 11273, n: 'Lugano', w: 'Sofas and tables', q: 'Rounded sofas with a matching oval coffee table.', p: 389, x: 3899, t: 'assets/t/lugano-living.webp', u: U('lugano-modern-living-room-furniture-collection') },
    { id: 13674, n: 'Nepal', w: 'Sofa, L-shape and tables', q: 'Low sofas and sculptural wood tables.', p: 389, x: 5199, t: 'assets/t/nepal-set.webp', u: U('nepal-modern-living-room-collection-concept') },
    { id: 14417, n: 'Bugatti', w: 'Sofa and chair', q: 'A soft, textured three-seater with rounded arms.', p: 1299, x: 2699, t: 'assets/t/bugatti-set.webp', u: U('bugatti-luxury-modern-living-room-collection') },
    { id: 7504, n: 'Dolphin Serenity', w: 'Sofas and chair', tr: true, q: 'Plush cushions on a tailored frame, raised on dark wood.', p: 1299, x: 2899, t: 'assets/t/dolphin-room.webp', u: U('dolphin-serenity-sofa-collection') },
    { id: 7484, n: 'Luxe', w: 'Sofas and chair', tr: true, q: 'Ivory upholstery and a bent-wood accent chair.', p: 1299, x: 2899, t: 'assets/t/luxe-room.webp', u: U('luxe-modern-comfort-sofa-collection') },
  ] },
  { group: 'Dining', items: [
    { id: 11473, n: 'Lugano', w: 'Table, chairs and console', q: 'An oval table, curved chairs and a console with mirror.', p: 389, x: 2899, t: 'assets/t/lugano-dining.webp', u: U('lugano-modern-dining-collection') },
    { id: 11439, n: 'Nepal', w: 'Table and chairs', q: 'A sculpted wood table with open-back chairs.', p: 389, x: 3499, t: 'assets/t/nepal-dining.webp', u: U('nepal-modern-dining-room-set') },
    { id: 11462, n: 'Torino', w: 'Table and chairs', q: 'Solid wood with brass accents.', p: 389, x: 3399, t: 'assets/t/torino-dining.webp', u: U('torino-contemporary-dining-collection') },
  ] },
];

/* The Zara sectional, matted in four of its fabrics. */
window.ZARA = {
  id: 11339, n: 'Zara sectional', p: 3199, u: U('zara-contemporary-taupe-sectional-sofa'), t: 'assets/zara/rust.webp',
  colours: [
    { key: 'beige', label: 'Beige', dot: '#d9cdb8', img: 'assets/c/zara-beige.webp' },
    { key: 'rust', label: 'Rust', dot: '#9a4a2a', img: 'assets/c/zara-rust.webp' },
    { key: 'green', label: 'Green', dot: '#6e7d4f', img: 'assets/c/zara-green.webp' },
    { key: 'yellow', label: 'Mustard', dot: '#c9a426', img: 'assets/c/zara-yellow.webp' },
  ],
};
