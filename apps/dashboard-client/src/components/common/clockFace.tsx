import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import React, { useEffect, useState } from 'react';

type ClockFaceProps = {
  currentTimeZone?: string;
  memberName?: string;
};

const ClockFace: React.FC<ClockFaceProps> = ({
  currentTimeZone = 'Africa/Johannesburg',
  memberName = 'User',
}) => {
  const [date, setDate] = useState(new Date());
  // first to zonedTime
  const [zonedTime, setZonedTime] = useState(toZonedTime(new Date(), currentTimeZone));
  // third to display
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
      setZonedTime(toZonedTime(new Date(), currentTimeZone));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTimeZone]);

  const isPM = zonedTime.getHours() >= 12;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Location */}
      <div className="mb-3">
        <span className="text-sm font-semibold text-white md:text-lg">{memberName}</span>
      </div>

      <div className="relative flex h-36 w-36 flex-col items-center justify-center rounded-full bg-gray-800 shadow-lg md:h-52 md:w-52">
        {/* Circle Border */}
        <div className="absolute inset-0 rounded-full border-[6px] border-purple-500 opacity-90"></div>
        {/* Time */}
        <span className="space-x-1 text-2xl font-bold text-white md:text-4xl">
          <span>{format(zonedTime, 'hh:mm')}</span>
          <span className="text-sm font-bold text-gray-500 md:text-xl">{isPM ? 'PM' : 'AM'}</span>
        </span>
        {/* Date */}
        <span className="mt-1 text-xs text-gray-400 md:text-sm">
          {format(date, 'MMMM d, yyyy')}
        </span>
      </div>
    </div>
  );
};

export default ClockFace;
