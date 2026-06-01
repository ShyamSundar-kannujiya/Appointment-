const StatCard = ({ title, value }) => {
  return (
    <div className="bg-slate-900 p-5 rounded-xl">
      <h3 className="text-slate-400">{title}</h3>

      <h1 className="text-3xl font-bold">{value}</h1>
    </div>
  );
};

export default StatCard;
