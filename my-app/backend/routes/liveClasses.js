import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const LiveClasses = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      let { data, error } = await supabase
        .from("live_classes")
        .select("*")
        .eq("status", "live");

      if (!error) setClasses(data);
    };

    fetchClasses();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("public:live_classes")
      .on("postgres_changes", { event: "*", schema: "public", table: "live_classes" }, (payload) => {
        setClasses((prevClasses) => [...prevClasses, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div>
      <h2>Live Classes</h2>
      {classes.length > 0 ? (
        <ul>
          {classes.map((c) => (
            <li key={c.id}>{c.title} - {c.status}</li>
          ))}
        </ul>
      ) : (
        <p>No live classes</p>
      )}
    </div>
  );
};

export default LiveClasses;
