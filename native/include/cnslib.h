#ifndef CNSLIB_H
#define CNSLIB_H

// holds info about a single keystroke
struct KeyEvent
{
    long tv_sec;
    long tv_usec;
    unsigned short code;
    unsigned int value;
};

#endif