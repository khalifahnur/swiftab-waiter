const COMMANDS = {
    ALIGN_LEFT: '\x1b\x61\x00', // Align text to the left
    ALIGN_CENTER: '\x1b\x61\x01', // Align text to the center
    ALIGN_RIGHT: '\x1b\x61\x02', // Align text to the right
    BOLD_ON: '\x1b\x45\x01', // Turn on bold
    BOLD_OFF: '\x1b\x45\x00', // Turn off bold
    FONT_SMALL: '\x1b\x4d\x01', // Set small font
    FONT_NORMAL: '\x1b\x4d\x00', // Set normal font
    LINE_FEED: '\x0a', // Line feed (new line)
    CUT_PAPER: '\x1d\x56\x42\x00', // Cut paper
  };
export default COMMANDS;  