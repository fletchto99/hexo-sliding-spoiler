Inspired by [hexo-spoiler](https://github.com/unnamed42/hexo-spoiler)

## Install

```bash
npm install hexo-sliding-spoiler --save
```

If hexo can't detect this plugin automatically, you need to modify the `plugins` section of `[path_to_your_site]/_config.yml` manually, like:

```yaml
plugins:
 - hexo-sliding-spoiler
```

## Syntax

```plain
{% sspoiler title %}
content
{% endsspoiler %}
```

It will hide your text and place the title at the top with a dropdown/scroll up arrow.

## Demo

![ ](img/example.gif)

## Example

### One word title

```plain
{% sspoiler word %}
content
{% endsspoiler %}
```

### Title containing spaces


```plain
{% sspoiler "Several spaces in the title" %}
content
{% endsspoiler %}
```
