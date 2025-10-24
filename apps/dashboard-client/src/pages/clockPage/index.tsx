import ClockFace from '@/components/common/clockFace';

const userTimeZones = [
  { memberName: 'Sehrik', timezone: 'Asia/Dhaka' },
  { memberName: 'Mutsah', timezone: 'Africa/Johannesburg' },
  { memberName: 'Skyler', timezone: 'America/Los_Angeles' },
];
function ClockFacePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-x-0 space-y-8 bg-gray-900 md:flex-row md:space-x-12 md:space-y-0">
      {userTimeZones.map((timeZone, index) => (
        <div key={index} className="rounded-3xl bg-gray-800 px-8 py-6 shadow-lg">
          <ClockFace currentTimeZone={timeZone.timezone} memberName={timeZone.memberName} />
        </div>
      ))}
    </div>
  );
}

export default ClockFacePage;
