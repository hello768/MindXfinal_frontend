function InfoSection({ hubId, sensorId }) {
  return (
    <div className="info-section">
      <div className="info-item">
        <span className="label">Hub ID:</span>
        <span className="value">{hubId}</span>
    </div>
    </div>
  );
}

export default InfoSection;
