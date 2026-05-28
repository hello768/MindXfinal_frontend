function InfoSection2({ hubId, sensorId }) {
    return (
        <div className="info-item">
          <span className="label">Sensor ID:</span>
          <span className="value">{sensorId}</span>
        </div>
    );
  }
  
  export default InfoSection2;