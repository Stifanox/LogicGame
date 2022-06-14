class FpsController {
  
    constructor(fps, callback) {
      this.delay = 1000 / fps;                                     // calc. time per frame
      this.time = null;                                            // start time
      this.frame = -1;                                             // frame count
      this.tref;                                                   // rAF time reference
      this.callback = callback;
      this.isPlaying = false;
    }
  
    loop = (timestamp) => {
      if (this.time === null) this.time = timestamp;               // init start time
      let seg = Math.floor((timestamp - this.time) / this.delay);  // calc frame no.
      if (seg > this.frame) {                                      // moved to next frame?
        this.frame = seg;                                          // update
        this.callback();
      }
      this.tref = requestAnimationFrame(this.loop);
    };
  
    start = () => {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.tref = requestAnimationFrame(this.loop);
      }
    };
  }
  
  export default FpsController;