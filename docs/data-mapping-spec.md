# Data Mapping Specification

```abnf
data-mapping   = transformation *( ";" *SP transformation )
transformation = source ":" destination
source         = ct-attr-name *( "." ct-attr-key ) [ "{" ct-attr-keys "}" ]
destination    = t1-attr-name [ "{" t1-attr-type "}" ]
t1-attr-name   = ALPHA *( ALPHA / DIGIT / "_" )
t1-attr-type   = "string" / "number" / "boolean" / "time" / "location" /
                 "strings" / "numbers" / "dates" / "locations"
ct-attr-name   = ALPHA *255( ALPHA / DIGIT / "_" / "-" )
ct-attr-keys   = ct-attr-key *( "," ct-attr-key )
ct-attr-key    = ALPHA *255( ALPHA / DIGIT / "_" / "-" )
```

where:

- `ct-attr-name` - attribute name from commercetools
- `ct-attr-key` - attribute value field name from commercetools (only
  applies when the attribute value is an object)
- `ct-attr-keys` - the keys that will be used to filter and order the
  values in the object
- `t1-attr-name` - attribute name from Talon.One
- `t1-attr-type` - attribute type from Talon.One (by default `"string"`)

## Example

### commercetools Attribute (source)

```json
{
  "name": "color",
  "value": {
    "key": "grey",
    "label": {
      "de": "grau",
      "en": "grey",
      "it": "grigio"
    }
  }
}
```

### Mapping configuration

```dotenv
CART_ITEM_ATTRIBUTE_MAPPING="color.key:t1_color; color.label:t1_colors{strings}; color.label{it,de}:t1_colors_de_it{strings}; color.label.de:t1_color_de; color:t1_color_raw"
```

### Sends to Talon.One

```json
{
  "t1_color": "grey",
  "t1_colors": ["grau", "grey", "grigio"],
  "t1_colors_de_it": ["grigio", "grau"],
  "t1_color_de": "grau",
  "t1_color_raw": "{\"key\":\"grey\",\"label\":{\"de\":\"grau\",\"en\":\"grey\",\"it\":\"grigio\"}}"
}
```

## References

- [RFC 5234 (ABNF)](https://tools.ietf.org/html/rfc5234)
