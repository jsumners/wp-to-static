# wp-to-static

`wp-to-static` is a tool that facilitates converting a [Wordpress][wp] XML
export to static HTML files.

This tool is meant to give you a head start on converting your Wordpress site.
You *will* have to do more work after running this tool. Wordpress's export
to XML feature ***does not*** export everything from your site. For example,
the excellent [Tablepress][tpress] plugin inserts tables into posts using
a Wordpress short code reference. When you export your site to XML Wordpress
will put the short code reference in the XML; it does not feed posts through
the normal rendering process that would generate the table in the post.

That being said, this tool greatly simplifies the process of converting
your site.

## Install

```bash
$ mkdir my-site # a working directory
$ cd my-site
$ npm install --production wp-to-static
```

* **Note:** this tool uses the expat library. As such, you'll need a working
node-gyp environment. I don't like that, but it was the only way to effectively
process the awful Wordpress export XML.

## Usage

* create a template
* create a config.js
* `./node-modules/.bin/wp-to-static -c config.js -f your_site.xml`

You can dump the default template and config like so:

```bash
$ ./node_modules/.bin/wp-to-static --genconfig > config.js
$ ./node_modules/.bin/wp-to-static --gentmpl > default.tmpl.html
```

You can get some minimal debug information by running with `DEBUG=1`:

```bash
$ DEBUG=1 ./node_modules/.bin/wp-to-static ...
```

## How It Works

`wp-to-static` parses the exported Wordpress XML document into a JavaScript
object with the following structure:

```javascript
{
  metadata: {},
  categories: {},
  tags: {},
  terms: {},
  attachments: {},
  pages: {},
  posts: {}
}
```

It then loops through each of the attachments to download them (from your
currently live Wordpress site), and then each of the pages and posts to
generate the static HTML documents according to a template. The template is a
standard [Handlebars][hb] template.

For each processed page and post, the aforementioned JavaScript object will
be used to construct a context to be passed in to Handlebars. You're able
to define this context yourself within your `config.js` script (see the
default config for an example).

**Note:** `wp-to-static` was written by using [devtidbits][dtb] excellent
[breakdown][bdwn] of the completely undocumented WXR format. If you need
further information about any of the properties described herein you should
reference his document.

Further, the XML elements and attributes have been normalized.
That is, an elment such as 'wp:author_email' would be an 'authorEmail' property
on an 'author' object.

You should dump the parsed and normalized JavaScript representation to a JSON
file to get familiar with the way `wp-to-static` will work with your site data:

```bash
$ wp-to-static --dump --config config.js --file your.export.xml > export.json
```

## License

[MIT License](http://jsumners.mit-license.org/)

[bdwn]: http://devtidbits.com/2011/03/16/the-wordpress-extended-rss-wxr-exportimport-xml-document-format-decoded-and-explained/
[dtb]: http://devtidbits.com/
[hb]: http://handlebarsjs.com/
[wp]: https://wordpress.org/
[tpress]: https://tablepress.org/
