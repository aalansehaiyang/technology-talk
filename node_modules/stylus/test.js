var stylus = require('./');


const value = `
$IMG = {
  temp: {
    selectors: ("test" "test1")
    props: {
      pop: "dies"
    }
  }
}

add-property(name, expr)
  {name} expr

generateImgClasses()
  for $img, $obj in $IMG
    {join(",", $obj.selectors)}
      for $prop in $IMG
        add-property($prop, "url(%s)" % $img)

html
  generateImgClasses()`;

stylus(value).render((err, css) => {
	if (err) {
		throw err;
	}
	console.log(css);
});
