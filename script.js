document.addEventListener('DOMContentLoaded', function() {
    const terminalBtn = document.getElementById('openTerminal');
    
    // Handle button click
    terminalBtn.addEventListener('click', function() {
        openTerminal();
    });
    
    // Handle Enter key press
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            openTerminal();
        }
    });
    
    // Add focus to button for better accessibility
    terminalBtn.focus();
    
    function openTerminal() {
        // Add a subtle loading effect
        terminalBtn.innerHTML = '<span class="btn-text">Opening...</span>';
        terminalBtn.disabled = true;
        
        // Simulate terminal opening (replace with actual terminal implementation)
        setTimeout(() => {
            // For now, just show an alert - replace with actual terminal
            alert('Terminal would open here. This is where you would integrate your actual terminal interface.');
            
            // Reset button state
            terminalBtn.innerHTML = '<span class="btn-text">Open Terminal</span>';
            terminalBtn.disabled = false;
        }, 500);
    }
    
    // Add some subtle animations on load
    setTimeout(() => {
        document.querySelector('.content').style.opacity = '1';
        document.querySelector('.content').style.transform = 'translateY(0)';
    }, 100);
});
