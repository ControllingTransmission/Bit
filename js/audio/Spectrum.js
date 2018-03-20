
Spectrum = {
    _sumPeak: 0,
    _isBeat: false,
    _fftSize: 32,
    
    audioBin: function() {
        return this._freqByteData
    },
    
	timeStep: function() 
	{
		if (this._analyserNode == null) { 
		    return 
		}
		
        this._analyserNode.getByteFrequencyData(this._freqByteData); 
		
		
		var sum = this._freqByteData.reduce(function(previousValue, currentValue, index, array) {
            return previousValue + currentValue;
        });

        for (var i = 0; i < this._freqByteData.length; i ++) {
            
            /*
    		if (isNaN(this._freqByteData[0])) { 
    		    this._freqByteData[0] = 0; 
    		}
    		*/
		
            var isBeat = (this._freqByteData[i] > this._peakByteData[i] * .9)
            this._beatByteData[i] = isBeat ? 1 : 0
            /*
            if (isBeat) {
                console.log(i, " beat!")
            }
            */
        }
                     
        
        for (var i = 0; i < this._freqByteData.length; i ++) {
            if (this._freqByteData[i] > this._peakByteData[i]) {
                this._peakByteData[i] = this._freqByteData[i]
            }
        }

   
        if (sum > this._sumPeak * .9) {
            this._isBeat = true
         //   console.log("beat!")
        }
        
        if (this._sumPeak < sum) {
            this._sumPeak = sum
        }
        
		return this._freqByteData
	},

	gotStream: function(stream) 
	{
	    this._inputPoint = this._audioContext.createGain();

	    // Create an AudioNode from the stream.
	    this._realAudioInput = this._audioContext.createMediaStreamSource(stream);
	    this._audioInput = this._realAudioInput;
	    this._audioInput.connect(this._inputPoint);

	    this._analyserNode = this._audioContext.createAnalyser();

        var size = this._fftSize
	    this._analyserNode.fftSize = size;
        this._freqByteData = new Uint8Array(size);
        this._peakByteData = new Uint8Array(size);
        this._beatByteData = new Uint8Array(size);
        
	    this._inputPoint.connect(this._analyserNode);

	    zeroGain = this._audioContext.createGain();
	   // zeroGain.gain.value = 0.0; // deprecated - using setTargetAtTime
	    zeroGain.gain.setTargetAtTime(0.0, 0, 0);
	    this._inputPoint.connect(zeroGain);
	    zeroGain.connect(this._audioContext.destination);
	    this.timeStep();
	},

	initAudio: function() 
	{
	    if (!navigator.getUserMedia)
		{
	        navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		}
		
	    navigator.getUserMedia({ audio:true }, function (s) { Spectrum.gotStream(s) }, function(e) {
            alert('Error getting audio');
            console.log(e);
	    });
	},
	
	setup: function()
	{
		this._audioContext = new AudioContext();
		this._audioInput = null
		this._realAudioInput = null
		this._inputPoint = null;
		this._analyserContext = null;
		
		window.addEventListener('load', function () { Spectrum.initAudio() });		
	}
}

Spectrum.setup()
