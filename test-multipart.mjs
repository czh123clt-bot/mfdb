async function test() {
  const fd = new FormData();
  fd.append('model', 'test-model');
  fd.append('prompt', 'test');
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
  fd.append('image', new Blob([buffer]), 'image.png');

  const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer dummy'
    },
    body: fd
  });
  console.log(await res.json());
}
test();
