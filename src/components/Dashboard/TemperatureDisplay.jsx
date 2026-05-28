function TemperatureDisplay({ temperature, timestamp }) {
  return (
    <>
      <div className="temperature-display">{temperature}°C</div>
    </>
  );
}

export default TemperatureDisplay;