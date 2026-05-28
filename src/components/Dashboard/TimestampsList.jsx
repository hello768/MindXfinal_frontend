function TimestampsList({ timestamps }) {
  if (!timestamps || !Array.isArray(timestamps)) {
    return (
      <div className="flex justify-center items-center py-4 text-gray-500 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {[...timestamps].reverse().map((ts, i) => {
        const displayIndex = timestamps.length - 1 - i;
        
        return (
          <div 
            key={i} 
            className="py-[8px] text-[13px] text-[#f0f0f0] border-b border-[#333] last:border-b-0 flex items-center"
          >
            <span className="text-[#ff8c42] font-bold min-w-[20px] mr-[10px]">
              {displayIndex}
            </span>
            <span className="truncate">{ts}</span>
          </div>
        );
      })}
    </div>
  );
}

export default TimestampsList;