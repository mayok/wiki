marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
})

console.log(marked('I an using __markdown__.'));
