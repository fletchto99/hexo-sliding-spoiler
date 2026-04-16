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
{% sliding-spoiler title %}
content
{% endsliding-spoiler %}
```

It will hide your text and place the title at the top with a dropdown/scroll up arrow.

> **⚠️ Breaking change (v2.0.0):** The tag was renamed from `{% spoiler %}` to
> `{% sliding-spoiler %}` to avoid conflicts with
> [hexo-spoiler](https://github.com/unnamed42/hexo-spoiler). Update your posts
> to use the new tag name.

## Demo

![ ](img/example.gif)

## Example

### One word title

```plain
{% sliding-spoiler word %}
content
{% endsliding-spoiler %}
```

### Title containing spaces


```plain
{% sliding-spoiler "Several spaces in the title" %}
content
{% endsliding-spoiler %}
```
