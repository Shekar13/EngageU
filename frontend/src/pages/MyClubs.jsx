import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import { Link } from "react-router-dom";

export default function MyClubs() {
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const USER_ID = user?.id;

  useEffect(() => {
    if (!USER_ID) return;

    axios.get(`http://localhost:5000/api/apply/${USER_ID}`)
      .then(res => {
        setMyClubs(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [USER_ID]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-secondary-500 pl-4">
          My Club Applications
        </h2>

        {myClubs.length === 0 && !loading ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg mb-4">You haven't applied to any clubs yet.</p>
            <Link to="/clubs" className="text-secondary-600 font-medium hover:text-secondary-700 hover:underline">
              Browse Student Clubs &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myClubs.map((app, index) => (
              <div key={app._id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card
                  title={app.clubId?.name || "Unknown Club"}
                  description={app.clubId?.description}
                  footer={
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold 
                                            ${app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              app.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'}`}>
                          {app.status || 'Applied'}
                        </span>
                      </div>

                      {app.status === 'Interview Scheduled' && app.interviewLink && (
                        <div className="mb-3 text-center">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Interview Scheduled</p>
                          <div className="bg-blue-50 text-blue-800 text-xs py-2 px-3 rounded-lg mb-2">
                            📅 {app.interviewDate} <br /> ⏰ {app.interviewTime}
                          </div>
                          <a
                            href={app.interviewLink}
                            target="_blank"
                            rel="noreferrer"
                            className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Join Interview (Meet)
                          </a>
                        </div>
                      )}

                      {app.status === 'Approved' && (
                        <div className="text-center text-green-600 font-medium text-sm bg-green-50 py-2 rounded">
                          🎉 You are a member!
                        </div>
                      )}
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
