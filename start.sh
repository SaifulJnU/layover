#!/bin/bash
echo "🛫  Starting Layover..."

# Start backend
cd backend && go run main.go &
BACKEND_PID=$!
echo "✅  Backend running at http://localhost:8080"

# Start frontend
cd ../frontend && npm run dev &
FRONTEND_PID=$!
echo "✅  Frontend running at http://localhost:5173"

echo ""
echo "🌍  Open http://localhost:5173 in your browser"
echo "   Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
