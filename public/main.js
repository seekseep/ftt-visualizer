navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
AudioContext = window.AudioContext || window.webkitAudioContext

function main () {
  var ctx, analyser

  function setup(stream) {
    var canvas = document.querySelector("#canvas")
    ctx = canvas.getContext("2d")

    var audioCtx = new AudioContext()
    analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048

    var sourceNode = audioCtx.createMediaStreamSource(stream)
    sourceNode.connect(analyser)
    // analyser.connect(audioCtx.destination)

    draw()
  }

  function draw() {
    var binCount = analyser.frequencyBinCount
    var data = new Uint8Array(binCount)
    analyser.getByteFrequencyData(data)

    ctx.fillStyle = '#CCC'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.lineWidth = 2
    ctx.strokeStyle = '#000'

    ctx.beginPath()
    var sliceWidth = canvas.width * 1.0 / binCount
    var x = 0

    for (var i = 0; i < binCount; i++) {

      var v = data[i] / 128.0
      var y = canvas.height - v * canvas.height / 2

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      x += sliceWidth
    }

    // ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()

    requestAnimationFrame(draw)
  }

  navigator.getUserMedia({
    audio: true,
  }, setup, function (error) {
    console.error(error)
  })
}

main()
