/**
 * Shape Drawing Utilities
 * 
 * KidPix-style chunky shapes with THICK BLACK OUTLINES
 */

export function drawShape(
  ctx: CanvasRenderingContext2D,
  type: string,
  x: number,
  y: number,
  size: number,
  color: string,
  rotation: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = color;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4; // THICK outlines for that KidPix vibe!

  switch (type) {
    case 'circle':
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'square':
      ctx.fillRect(-size / 2, -size / 2, size, size);
      ctx.strokeRect(-size / 2, -size / 2, size, size);
      break;
      
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'star':
      drawStar(ctx, 0, 0, 5, size / 2, size / 4);
      ctx.fill();
      ctx.stroke();
      break;
      
    case 'heart':
      drawHeart(ctx, 0, 0, size);
      ctx.fill();
      ctx.stroke();
      break;
  }

  ctx.restore();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
): void {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  const width = size;
  const height = size;
  
  ctx.beginPath();
  const topCurveHeight = height * 0.3;
  
  ctx.moveTo(x, y + topCurveHeight);
  
  // Left curve
  ctx.bezierCurveTo(
    x,
    y,
    x - width / 2,
    y,
    x - width / 2,
    y + topCurveHeight
  );
  
  // Left bottom
  ctx.bezierCurveTo(
    x - width / 2,
    y + (height + topCurveHeight) / 2,
    x,
    y + (height + topCurveHeight) / 2,
    x,
    y + height
  );
  
  // Right bottom
  ctx.bezierCurveTo(
    x,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + topCurveHeight
  );
  
  // Right curve
  ctx.bezierCurveTo(
    x + width / 2,
    y,
    x,
    y,
    x,
    y + topCurveHeight
  );
  
  ctx.closePath();
}

/**
 * Draw text with outline (for baby words, numbers, symbols)
 */
export function drawTextWithOutline(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string
): void {
  ctx.save();
  ctx.font = `bold ${size}px "Comic Sans MS", "Comic Sans", cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.strokeText(text, x, y);
  
  // Fill
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  
  ctx.restore();
}

