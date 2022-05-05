export const drawRect = (detections, ctx) =>{
  // Loop through each prediction
  detections.forEach(prediction => {

    // Extract boxes and classes
    const [x, y, width, height] = prediction['bbox']; 
    const text = prediction['class']; 
    const score = prediction['score'];
    const scorePerc = Number.parseFloat(score * 100).toFixed(0);
    const textScore = text + " " + scorePerc + "%";
    // Set styling
    const color = Math.floor(Math.random()*16777215).toString(16);
    ctx.strokeStyle = '#' + color
    ctx.font = '18px Arial';

    // Draw rectangles and text
    ctx.beginPath();   
    ctx.fillStyle = '#' + color
    ctx.fillText(textScore, x, y);
    ctx.rect(x, y, width, height); 
    ctx.stroke();
  });
}