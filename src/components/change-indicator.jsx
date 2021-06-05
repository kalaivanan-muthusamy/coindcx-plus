function ChangeIndicator({ change }) {
  return (
    <div className="change-indicator">
      <div className="change-value">{parseFloat(change).toFixed(2)}%</div>
      <div className={change > 0 ? "change-plus" : "change-minus"} />
    </div>
  );
}

export default ChangeIndicator;
