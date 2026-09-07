import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, Clock, Bot, Plus } from 'lucide-react';

// Mock meetings data with dates
const mockMeetings = [
  {
    id: '1',
    name: 'Product Strategy Discussion',
    agentName: 'Strategy Assistant',
    date: new Date(),
    time: '10:00 AM',
    duration: '1h',
    status: 'upcoming'
  },
  {
    id: '2',
    name: 'Team Standup',
    agentName: 'Meeting Facilitator',
    date: new Date(),
    time: '2:00 PM',
    duration: '30m',
    status: 'active'
  },
  {
    id: '3',
    name: 'Client Review Meeting',
    agentName: 'Client Relations Bot',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: '11:00 AM',
    duration: '1h 30m',
    status: 'upcoming'
  },
  {
    id: '4',
    name: 'Technical Architecture Planning',
    agentName: 'Tech Lead Assistant',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '3:00 PM',
    duration: '2h',
    status: 'upcoming'
  },
  {
    id: '5',
    name: 'Weekly Review',
    agentName: 'Product Analyst',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '4:00 PM',
    duration: '1h',
    status: 'upcoming'
  }
];

function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getMeetingsForDate = (date) => {
    return mockMeetings.filter(meeting => {
      const meetingDate = new Date(meeting.date);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const selectDate = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const days = getDaysInMonth(currentDate);
  const selectedMeetings = getMeetingsForDate(selectedDate);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar</h1>
          <p className="text-gray-400">View and manage your scheduled meetings</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <h2 className="text-xl font-semibold text-white">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button 
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs md:text-sm font-medium text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-12" />;
              }

              const hasMeetings = getMeetingsForDate(date).length > 0;
              const today = isToday(date);
              const selected = isSelected(date);

              return (
                <button
                  key={index}
                  onClick={() => selectDate(date)}
                  className={`
                    h-10 md:h-12 rounded-lg flex flex-col items-center justify-center transition-all duration-200
                    ${today ? 'bg-violet-600 text-white' : ''}
                    ${selected && !today ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : ''}
                    ${!today && !selected ? 'hover:bg-violet-500/10 text-gray-300' : ''}
                  `}
                >
                  <span className="text-xs md:text-sm font-medium">{date.getDate()}</span>
                  {hasMeetings && (
                    <div className="flex gap-1 mt-1">
                      <div className="w-1 h-1 bg-violet-400 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Meetings */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-violet-500/20 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <CalendarIcon className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
          </div>

          {selectedMeetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-400">No meetings scheduled</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedMeetings.map(meeting => (
                <div 
                  key={meeting.id}
                  className="bg-slate-800/50 border border-violet-500/20 rounded-lg p-4 hover:border-violet-500/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-sm mb-1">
                        {meeting.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{meeting.time} • {meeting.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Bot className="w-3 h-3" />
                        <span>{meeting.agentName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;