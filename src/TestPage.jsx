// src/TestPage.jsx
function TestPage() {
  return (
    <div
      style={{ padding: "40px", textAlign: "center", fontFamily: "sans-serif" }}
    >
      <h1>🎉 Success!</h1>
      <p>This is your brand new test page.</p>
      <button onClick={() => alert("It works!")}>Click Me</button>
    </div>
  );
}

export default TestPage;
