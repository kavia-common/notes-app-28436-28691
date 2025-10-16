#!/bin/bash

# Make all scripts executable
chmod +x quick-start.sh
chmod +x test-api-connection.sh
chmod +x verify-backend.js

echo "✓ All scripts are now executable"
echo ""
echo "You can now run:"
echo "  ./quick-start.sh           - Automated setup and start"
echo "  ./test-api-connection.sh   - Test backend connectivity"
echo "  node verify-backend.js     - Verify backend (Node.js)"
