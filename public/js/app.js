$(() => {
    $('#msgholder').hide();
    const video = document.querySelector('video');

    navigator.mediaDevices
        .getUserMedia({ video: { width: 426, height: 240 } })
        .then((stream) => { video.srcObject = stream; });


    function getFrame() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const data = canvas.toDataURL('image/png');
        return data;
    }


    const socket = io.connect();

    socket.on('processed', (data) => {
        const imgBase64 = `data:image/jpeg;base64,${data}`;
        $('#processed')
            .attr('src', imgBase64);
    });

    socket.on('whoops', (message) => {
        $('#whoops').html(message);
    });

    socket.on('match', (message) => {
        $('#whoops').html('');
        $('#celeb')
            .attr('src', message.url);

        $('#celebname')
            .html(message.name);
        $('#celebconfidence')
            .html(message.confidence);
        $('#celebmsg')
            .html(message.message);
        $('#msgholder').show();
    });

    $('#facematch').on('click', () => {
        const frame = getFrame();
        socket.emit('image', frame);
    });
});
