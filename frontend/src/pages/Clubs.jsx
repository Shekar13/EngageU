import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedClubIds, setAppliedClubIds] = useState(new Set());

  const user = JSON.parse(localStorage.getItem("user"));
  const USER_ID = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/clubs`);
        setClubs(clubsRes.data);

        if (USER_ID) {
          const appsRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/apply/${USER_ID}`);
          const appIds = new Set(appsRes.data.map(app => app.clubId._id));
          setAppliedClubIds(appIds);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [USER_ID]);

  const applyClub = async (clubId) => {
    if (!USER_ID) {
      alert("Please login to apply");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/apply`, {
        userId: USER_ID,
        clubId
      });

      // Update local state to reflect application immediately
      setAppliedClubIds(prev => new Set(prev).add(clubId));
      alert("Applied successfully 🎉");
    } catch {
      alert("Already applied");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary-600 to-primary-600 mb-4 animate-fade-in">
            Student Clubs
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto animate-slide-up">
            Find your tribe. Join clubs that match your interests and grow your potential.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club, index) => {
              if (!club.name) return null;

              const isApplied = appliedClubIds.has(club._id);

              return (
                <div key={club._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Card
                    title={club.name}
                    description={club.description}
                    footer={
                      club.recruiting ? (
                        <Button
                          onClick={() => !isApplied && applyClub(club._id)}
                          variant={isApplied ? "secondary" : "secondary"}
                          className={`w-full ${isApplied
                            ? "bg-yellow-50 text-yellow-600 border-yellow-200 cursor-default hover:shadow-none hover:bg-yellow-50"
                            : "border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600"
                            }`}
                          disabled={isApplied}
                        >
                          {isApplied ? "Application Sent" : "Apply for Recruitment"}
                        </Button>
                      ) : (
                        <div className="w-full text-center py-2 text-gray-400 text-sm italic bg-gray-50 rounded-full border border-gray-100">
                          Recruitment Closed
                        </div>
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
