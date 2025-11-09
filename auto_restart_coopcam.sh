#!/bin/bash

# Auto-restart script for coopcam.py (Shell script version)
# This script monitors coopcam.py and restarts it if it crashes

# Configuration
SCRIPT_NAME="coopcam.py"
RESTART_DELAY=5
MAX_RESTARTS=10
RESTART_COUNT=0
LOG_FILE="auto_restart.log"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_PATH="$SCRIPT_DIR/$SCRIPT_NAME"
PID_FILE="$SCRIPT_DIR/coopcam.pid"

# Function to write log messages
write_log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "$timestamp - $message"
    echo "$timestamp - $message" >> "$LOG_FILE"
}

# Function to check if process is running
is_process_running() {
    local pid="$1"
    if [ -z "$pid" ]; then
        return 1
    fi
    
    if kill -0 "$pid" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to start coopcam process
start_coopcam() {
    write_log "Starting $SCRIPT_NAME..."
    
    # Check if script exists
    if [ ! -f "$SCRIPT_PATH" ]; then
        write_log "ERROR: Script $SCRIPT_PATH not found!"
        return 1
    fi
    
    # Change to script directory
    cd "$SCRIPT_DIR" || {
        write_log "ERROR: Cannot change to directory $SCRIPT_DIR"
        return 1
    }
    
    # Start the Python script in background
    python3 "$SCRIPT_NAME" &
    local pid=$!
    
    # Save PID to file
    echo "$pid" > "$PID_FILE"
    
    # Check if process actually started
    sleep 1
    if is_process_running "$pid"; then
        write_log "Started $SCRIPT_NAME with PID: $pid"
        RESTART_COUNT=$((RESTART_COUNT + 1))
        return 0
    else
        write_log "ERROR: Failed to start $SCRIPT_NAME"
        return 1
    fi
}

# Function to stop process gracefully
stop_coopcam() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        
        if is_process_running "$pid"; then
            write_log "Stopping $SCRIPT_NAME (PID: $pid)..."
            
            # Try graceful shutdown first
            kill -TERM "$pid" 2>/dev/null
            
            # Wait up to 10 seconds for graceful shutdown
            local count=0
            while [ $count -lt 10 ] && is_process_running "$pid"; do
                sleep 1
                count=$((count + 1))
            done
            
            # Force kill if still running
            if is_process_running "$pid"; then
                write_log "Process didn't stop gracefully, force killing..."
                kill -KILL "$pid" 2>/dev/null
                sleep 1
            fi
            
            write_log "Process stopped"
        fi
        
        # Remove PID file
        rm -f "$PID_FILE"
    fi
}

# Function to handle signals for graceful shutdown
cleanup() {
    write_log "Received interrupt signal. Shutting down..."
    stop_coopcam
    write_log "=== Monitor stopped ==="
    exit 0
}

# Function to get process status
get_process_status() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if is_process_running "$pid"; then
            echo "running"
            return 0
        else
            # Process died, clean up PID file
            rm -f "$PID_FILE"
            echo "stopped"
            return 1
        fi
    else
        echo "stopped"
        return 1
    fi
}

# Main monitoring function
start_monitoring() {
    write_log "=== CoopCam Auto-Restart Monitor Started ==="
    write_log "Monitoring script: $SCRIPT_PATH"
    write_log "Max restart attempts: $MAX_RESTARTS"
    write_log "Restart delay: $RESTART_DELAY seconds"
    write_log "Press Ctrl+C to stop monitoring"
    
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Start initial process
    if ! start_coopcam; then
        write_log "ERROR: Failed to start initial process. Exiting."
        exit 1
    fi
    
    # Main monitoring loop
    while true; do
        sleep 1
        
        # Check if process is still running
        local status=$(get_process_status)
        
        if [ "$status" = "stopped" ]; then
            write_log "WARNING: $SCRIPT_NAME stopped running"
            
            # Check if we've exceeded max restart attempts
            if [ $RESTART_COUNT -ge $MAX_RESTARTS ]; then
                write_log "ERROR: Maximum restart attempts ($MAX_RESTARTS) reached. Giving up."
                break
            fi
            
            write_log "Restarting in $RESTART_DELAY seconds... (Attempt $((RESTART_COUNT + 1))/$MAX_RESTARTS)"
            sleep $RESTART_DELAY
            
            # Attempt restart
            if ! start_coopcam; then
                write_log "ERROR: Failed to restart process"
                sleep $((RESTART_DELAY * 2))  # Wait longer before next attempt
                continue
            fi
            
            write_log "Process restarted successfully"
        fi
    done
    
    # Clean shutdown
    stop_coopcam
    write_log "=== Monitor stopped ==="
}

# Function to show usage
show_usage() {
    echo "Usage: $0 {start|stop|status|restart}"
    echo ""
    echo "Commands:"
    echo "  start    - Start monitoring coopcam.py"
    echo "  stop     - Stop monitoring and coopcam.py"
    echo "  status   - Show current status"
    echo "  restart  - Restart the monitor"
    echo ""
    echo "Configuration:"
    echo "  Script: $SCRIPT_PATH"
    echo "  Max restarts: $MAX_RESTARTS"
    echo "  Restart delay: $RESTART_DELAY seconds"
}

# Function to show status
show_status() {
    local status=$(get_process_status)
    
    if [ "$status" = "running" ]; then
        local pid=$(cat "$PID_FILE")
        echo "CoopCam is running (PID: $pid)"
        echo "Monitor status: Active"
        
        # Show some process info
        if command -v ps >/dev/null; then
            echo "Process info:"
            ps -p "$pid" -o pid,ppid,cmd,etime 2>/dev/null || echo "  Process details unavailable"
        fi
    else
        echo "CoopCam is not running"
        echo "Monitor status: Inactive"
    fi
    
    # Show recent log entries
    if [ -f "$LOG_FILE" ]; then
        echo ""
        echo "Recent log entries:"
        tail -5 "$LOG_FILE" 2>/dev/null | while read line; do
            echo "  $line"
        done
    fi
}

# Main script logic
case "${1:-start}" in
    start)
        # Check if already running
        if [ "$(get_process_status)" = "running" ]; then
            echo "CoopCam monitor is already running"
            exit 1
        fi
        start_monitoring
        ;;
    stop)
        stop_coopcam
        echo "CoopCam monitor stopped"
        ;;
    status)
        show_status
        ;;
    restart)
        stop_coopcam
        sleep 2
        start_monitoring
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
