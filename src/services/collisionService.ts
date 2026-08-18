const GAP = 0.2;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function overlaps(a: Rect, b: Rect): boolean {
  return (
    a.x         < b.x + b.w + GAP &&
    a.x + a.w   > b.x       - GAP &&
    a.y         < b.y + b.h + GAP &&
    a.y + a.h   > b.y       - GAP
  );
}

/**
 * Return the nearest (x, y) where `dragged` does not overlap any rect in `others`.
 * Respects canvas left/top boundary (x >= 0, y >= 0).
 * When going left would cross the boundary, falls back to pushing right or down.
 */
export function resolveNoOverlap(
  dragged: Rect,
  others: Rect[],
  maxIter = 60,
): { x: number; y: number } {
  let x = Math.max(0, dragged.x);
  let y = Math.max(0, dragged.y);

  for (let iter = 0; iter < maxIter; iter++) {
    let moved = false;

    for (const other of others) {
      const r: Rect = { x, y, w: dragged.w, h: dragged.h };
      if (!overlaps(r, other)) continue;

      const pushRight = other.x + other.w + GAP - x;
      const pushLeft  = x + dragged.w + GAP - other.x;
      const pushDown  = other.y + other.h + GAP - y;
      const pushUp    = y + dragged.h + GAP - other.y;

      // Candidates sorted by smallest push; skip left if it would go out of bounds
      const candidates: { dist: number; apply: () => void }[] = [
        { dist: pushRight, apply: () => { x += pushRight; } },
        { dist: pushDown,  apply: () => { y += pushDown;  } },
        { dist: pushUp,    apply: () => { y  = Math.max(0, y - pushUp); } },
      ];

      if (x - pushLeft >= 0) {
        candidates.push({ dist: pushLeft, apply: () => { x -= pushLeft; } });
      }

      candidates.sort((a, b) => a.dist - b.dist);
      candidates[0].apply();

      // Re-clamp after every push so boundary is always respected
      x = Math.max(0, x);
      y = Math.max(0, y);

      moved = true;
    }

    if (!moved) break;
  }

  return { x, y };
}
