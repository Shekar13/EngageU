import { useEffect, useState } from "react";
import axios from "axios";

export default function Admin() {
  const [registrations, setRegistrations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Grouping State
  const [groupedRegistrations, setGroupedRegistrations] = useState({});
  const [groupedApplications, setGroupedApplications] = useState({});

  // Accordion State
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [expandedClubId, setExpandedClubId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [regRes, appRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/registrations`, { headers: { userid: user.id } }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/admin/applications`, { headers: { userid: user.id } })
        ]);
        setRegistrations(regRes.data);
        setApplications(appRes.data);

        // Group Registrations by Event
        const regMap = {};
        regRes.data.forEach(reg => {
          const eventId = reg.eventId?._id;
          if (!eventId) return;
          if (!regMap[eventId]) {
            regMap[eventId] = {
              event: reg.eventId,
              users: []
            };
          }
          regMap[eventId].users.push(reg);
        });
        setGroupedRegistrations(regMap);

        // Group Applications by Club
        const appMap = {};
        appRes.data.forEach(app => {
          const clubId = app.clubId?._id;
          if (!clubId) return;
          if (!appMap[clubId]) {
            appMap[clubId] = {
              club: app.clubId,
              applicants: []
            };
          }
          appMap[clubId].applicants.push(app);
        });
        setGroupedApplications(appMap);

      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const updateApplicationStatus = async (id, status, interviewLink = "", interviewDate = "", interviewTime = "") => {
    console.log(`Updating app ${id} to ${status}`);
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/apply/${id}`, {
        status,
        interviewLink,
        interviewDate,
        interviewTime
      });
      console.log("Update success:", response.data);

      // Update local state (both flat list and grouped list if needed, but we rely on flat list for fetching so let's update apps locally)
      // Actually we need to update the groupedApplications state to reflect changes immediately in UI
      setGroupedApplications(prev => {
        const newMap = { ...prev };
        // Find the club this app belongs to
        for (const clubId in newMap) {
          const appIndex = newMap[clubId].applicants.findIndex(a => a._id === id);
          if (appIndex !== -1) {
            const updatedApp = {
              ...newMap[clubId].applicants[appIndex],
              status,
              interviewLink,
              interviewDate,
              interviewTime
            };
            newMap[clubId].applicants[appIndex] = updatedApp;
            break;
          }
        }
        return newMap;
      });

    } catch (err) {
      console.error("Failed to update status", err.response?.data || err.message);
      alert(`Failed to update application status: ${err.response?.data?.msg || err.message}`);
    }
  };

  const handleScheduleInterview = (id) => {
    const link = prompt("Enter Google Meet Link:");
    if (!link) return;

    const date = prompt("Enter Interview Date (e.g., 25th March):");
    if (!date) return;

    const time = prompt("Enter Interview Time (e.g., 10:00 AM):");
    if (!time) return;

    if (link && date && time) {
      updateApplicationStatus(id, 'Interview Scheduled', link, date, time);
    }
  };

  const toggleEvent = (id) => setExpandedEventId(expandedEventId === id ? null : id);
  const toggleClub = (id) => setExpandedClubId(expandedClubId === id ? null : id);

  if (!user) return <div className="min-h-screen pt-24 px-4 md:px-8 text-center text-gray-500">Please login as admin</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 md:pt-24 px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 mb-8 border-b border-gray-200 pb-4">
          Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Event Registrations Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up">
            <div className="bg-primary-50 px-6 py-4 border-b border-primary-100">
              <h3 className="text-lg font-semibold text-primary-800 flex items-center">
                <span className="bg-primary-200 text-primary-700 text-xs font-bold px-2 py-1 rounded-full mr-2">{registrations.length}</span>
                Total Event Registrations
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : Object.keys(groupedRegistrations).length === 0 ? (
                <div className="p-8 text-center text-gray-400">No registrations found.</div>
              ) : (
                Object.values(groupedRegistrations).map(group => (
                  <div key={group.event._id} className="border-b last:border-0 border-gray-100">
                    <button
                      onClick={() => toggleEvent(group.event._id)}
                      className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors text-left outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {group.users.length}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 line-clamp-1">{group.event.title}</h4>
                          <p className="text-xs text-gray-500">{group.event.date}</p>
                        </div>
                      </div>
                      <span className="text-gray-400">
                        {expandedEventId === group.event._id ? '▲' : '▼'}
                      </span>
                    </button>

                    {/* Expanded List */}
                    {expandedEventId === group.event._id && (
                      <div className="bg-gray-50 p-4 border-t border-gray-100">
                        <ul className="space-y-3">
                          {group.users.map(reg => (
                            <li key={reg._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                              <div>
                                <p className="font-medium text-sm text-gray-800">{reg.userId?.name || "Unknown"}</p>
                                <p className="text-xs text-gray-500 break-all">{reg.userId?.email}</p>
                              </div>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded shrink-0">Registered</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Club Applications Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-secondary-50 px-6 py-4 border-b border-secondary-100">
              <h3 className="text-lg font-semibold text-secondary-800 flex items-center">
                <span className="bg-secondary-200 text-secondary-700 text-xs font-bold px-2 py-1 rounded-full mr-2">{applications.length}</span>
                Total Club Applications
              </h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-gray-400">Loading...</div>
              ) : Object.keys(groupedApplications).length === 0 ? (
                <div className="p-8 text-center text-gray-400">No applications found.</div>
              ) : (
                Object.values(groupedApplications).map(group => (
                  <div key={group.club._id} className="border-b last:border-0 border-gray-100">
                    <button
                      onClick={() => toggleClub(group.club._id)}
                      className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors text-left outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {group.applicants.length}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 line-clamp-1">{group.club.name}</h4>
                          <p className="text-xs text-gray-500">Club Application</p>
                        </div>
                      </div>
                      <span className="text-gray-400">
                        {expandedClubId === group.club._id ? '▲' : '▼'}
                      </span>
                    </button>

                    {/* Expanded List */}
                    {expandedClubId === group.club._id && (
                      <div className="bg-gray-50 p-4 border-t border-gray-100">
                        <ul className="space-y-4">
                          {group.applicants.map(a => (
                            <li key={a._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                              <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-2">
                                <div>
                                  <p className="font-medium text-sm text-gray-900">{a.userId?.name || "Unknown"}</p>
                                  <p className="text-xs text-gray-500 break-all">{a.userId?.email}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold shrink-0
                                                ${a.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                    a.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                      a.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-700' :
                                        'bg-yellow-100 text-yellow-700'}`}>
                                  {a.status || 'Applied'}
                                </span>
                              </div>

                              <div className="flex flex-wrap justify-start sm:justify-end gap-2">
                                {a.status !== 'Approved' && a.status !== 'Rejected' && (
                                  <>
                                    {a.status !== 'Interview Scheduled' && (
                                      <button
                                        onClick={() => handleScheduleInterview(a._id)}
                                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition"
                                      >
                                        Schedule Interview
                                      </button>
                                    )}
                                    <button
                                      onClick={() => updateApplicationStatus(a._id, 'Approved')}
                                      className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded border border-green-200 hover:bg-green-100 transition"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => updateApplicationStatus(a._id, 'Rejected')}
                                      className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200 hover:bg-red-100 transition"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                              {a.status === 'Interview Scheduled' && a.interviewLink && (
                                <div className="mt-2 pt-2 border-t border-gray-100 text-left sm:text-right">
                                  <a href={a.interviewLink} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline break-all">
                                    Join Meet
                                  </a>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {a.interviewDate} @ {a.interviewTime}
                                  </p>
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
