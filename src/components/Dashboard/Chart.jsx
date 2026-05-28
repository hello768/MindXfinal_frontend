import { useEffect, useRef } from "react";

function Chart({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    drawChart();
    
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, [data]);

  const drawChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    const displayWidth = canvas.parentNode.offsetWidth;
    const displayHeight = canvas.parentNode.offsetHeight;
    
    canvas.width = displayWidth * ratio;
    canvas.height = displayHeight * ratio;
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
    
    ctx.scale(ratio, ratio);
    
    const padding = 40;
    const chartAreaWidth = displayWidth - 2 * padding;
    const chartAreaHeight = displayHeight - 2 * padding; 

    let minTemp = Math.min(...data) - 0.5;
    let maxTemp = Math.max(...data) + 0.5;
    if (minTemp === maxTemp) {
        minTemp -= 5;
        maxTemp += 5;
    }
    
    ctx.clearRect(0, 0, displayWidth, displayHeight); 
    
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, displayHeight - padding);
    ctx.lineTo(displayWidth - padding, displayHeight - padding); 
    ctx.stroke();
    
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartAreaHeight / 5) * i;
      const temp = maxTemp - ((maxTemp - minTemp) / 5) * i;
      
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(displayWidth - padding, y); 
      ctx.strokeStyle = '#333';
      ctx.stroke();
      
      ctx.fillText(temp.toFixed(1) + '°C', 5, y + 4);
    }
    
    for (let i = 0; i < 10; i++) {
      const x = padding + (chartAreaWidth / 9) * i;
      ctx.fillText(i.toString(), x - 5, displayHeight - padding + 20); 
    }
    
    ctx.strokeStyle = '#ff8c42';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((temp, i) => {
      const x = padding + (chartAreaWidth / 9) * i;
      const y = padding + chartAreaHeight - ((temp - minTemp) / (maxTemp - minTemp)) * chartAreaHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    data.forEach((temp, i) => {
      const x = padding + (chartAreaWidth / 9) * i;
      const y = padding + chartAreaHeight - ((temp - minTemp) / (maxTemp - minTemp)) * chartAreaHeight;
      
      ctx.fillStyle = '#ff8c42';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

export default Chart;