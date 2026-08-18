const GAP = 12; // minimum space between blocks

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function overlaps(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w + GAP &&
    a.x + a.w + GAP > b.x &&
    a.y < b.y + b.h + GAP &&
    a.y + a.h + GAP > b.y
  );
}

/**
 * Given a dragged rect and a list of static rects, return the
 * nearest x/y that avoids all overlaps (iterative minimal push).
 */
export function resolveNoOverlap(
  dragged: Rect,
  others: Rect[],
  maxIter = 30
): { x: number; y: number } {
  let { x, y } = dragged;

  for (let iter = 0; iter < maxIter; iter++) {
    let moved = false;

    for (const other of others) {
      const r: Rect = { x, y, w: dragged.w, h: dragged.h };
      if (!overlaps(r, other)) continue;

      // Amount needed to push in each of the 4 directions
      const pushRight = other.x + other.w + GAP - x;
      const pushLeft  = x + dragged.w + GAP - other.x;
      const pushDown  = other.y + other.h + GAP - y;
      const pushUp    = y + dragged.h + GAP - other.y;

      const min = Math.min(pushRight, pushLeft, pushDown, pushUp);

      if      (min === pushRight) x += pushRight;
      else if (min === pushLeft)  x -= pushLeft;
      else if (min === pushDown)  y += pushDown;
      else                        y -= pushUp;

      moved = true;
    }

    if (!moved) break;
  }

  return { x: Math.max(0, x), y: Math.max(0, y) };
}
