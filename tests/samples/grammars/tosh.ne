
line -> thing {% id %}

thing -> block {% id %}
       | r_parens {% id %}
       | b_parens {% id %}

n -> n4 {% id %}

sb -> join {% id %}
    | n4 {% id %}
    | s0 {% id %}

b -> b8 {% id %}

c -> r_parens {% id %}
   | c0 {% id %}

r_parens -> "(" _ r_value _ ")" {% ({data}) => data[2] %}

r_value -> join {% id %}
         | n4 {% id %}

b_parens -> "<" _ b8 _ ">" {% ({data}) => data[2] %}

predicate -> simple_predicate {% id %}

join -> "join" __ jpart __ jpart {% ({data}) => ["concatenate:with:", data[2], data[4]] %}

jpart -> s0 {% id %}
       | "_" {% ({data}) => "" %}
       | join {% id %}
       | r_parens {% id %}
       | b_parens {% id %}

predicate -> "touching" __ "color" __ c _ "?" {% ({data}) => ["touchingColor:", data[4]] %}
           | "color" __ c __ "is" __ "touching" __ c _ "?" {% ({data}) => ["color:sees:", data[2], data[8]] %}

b8 -> b_and {% id %}
    | b_or {% id %}
    | b7 {% id %}

b_and -> b_and __ "and" __ b7 {% ({data}) => ["&", data[0], data[4]] %}
       | b7 __ "and" __ b7 {% ({data}) => ["&", data[0], data[4]] %}

b_or -> b_or __ "or" __ b7 {% ({data}) => ["|", data[0], data[4]] %}
      | b7 __ "or" __ b7 {% ({data}) => ["|", data[0], data[4]] %}

b7 -> "not" __ b7 {% ({data}) => ["not", data[2]] %}
    | b6 {% id %}

b6 -> sb _ "<" _ sb {% ({data}) => ["<", data[0], data[4]] %}
    | sb _ ">" _ sb {% ({data}) => [">", data[0], data[4]] %}
    | sb _ "=" _ sb {% ({data}) => ["=", data[0], data[4]] %}
    | m_list __ "contains" __ sb _ "?" {% ({data}) => ["list:contains:", data[0], data[4]] %}
    | predicate {% id %}
    | b2 {% id %}

b2 -> b_parens {% id %}
    | b0 {% id %}

n4 -> n4 _ "+" _ n3 {% ({data}) => ["+", data[0], data[4]] %}
    | n4 _ "-" _ n3 {% ({data}) => ["-", data[0], data[4]] %}
    | n3 {% id %}

n3 -> n3 _ "*" _ n2 {% ({data}) => ["*", data[0], data[4]] %}
    | n3 _ "/" _ n2 {% ({data}) => ["/", data[0], data[4]] %}
    | n3 _ "mod" _ n2 {% ({data}) => ["%", data[0], data[4]] %}
    | n2 {% id %}

n2 -> "round" __ n2 {% ({data}) => ["rounded", data[2]] %}
    | m_mathOp __ "of" __ n2 {% ({data}) => ["computeFunction:of:", data[0], data[4]] %}
    | "pick" __ "random" __ n4 __ "to" __ n2 {% ({data}) => ["randomFrom:to:", data[4], data[8]] %}
    | m_attribute __ "of" __ m_spriteOrStage {% ({data}) => ["getAttribute:of:", data[0], data[4]] %}
    | "distance" __ "to" __ m_spriteOrMouse {% ({data}) => ["distanceTo:", data[4]] %}
    | "length" __ "of" __ s2 {% ({data}) => ["stringLength:", data[4]] %}
    | "letter" __ n __ "of" __ s2 {% ({data}) => ["letter:of:", data[2], data[6]] %}
    | n1 {% id %}

n1 -> simple_reporter {% id %}
    | r_parens {% id %}
    | b_parens {% id %}
    | n0 {% id %}

s2 -> s0 {% id %}
    | n1 {% id %}

n0 -> "-" _ number {% ({data}) => -data[2] %}
    | number {% ({data}) => data[0] %}
    | "_" {% ({data}) => 0 %}

s0 -> string {% id %}

b0 -> "<>" {% ({data}) => false %}

c0 -> color {% id %}

_greenFlag -> "flag"
            | "green" __ "flag"

_turnLeft -> "ccw"
           | "left"

_turnRight -> "cw"
            | "right"

c0 -> "red" {% id %}
    | "orange" {% id %}
    | "yellow" {% id %}
    | "green" {% id %}
    | "blue" {% id %}
    | "purple" {% id %}
    | "black" {% id %}
    | "white" {% id %}
    | "pink" {% id %}
    | "brown" {% id %}

m_attribute -> "x" __ "position" {% ({data}) => "x position" %}
             | "y" __ "position" {% ({data}) => "y position" %}
             | "direction" {% id %}
             | "costume" __ "#" {% ({data}) => "costume #" %}
             | "costume" __ "name" {% ({data}) => "costume name" %}
             | "backdrop" __ "#" {% ({data}) => "backdrop #" %}
             | "backdrop" __ "name" {% ({data}) => "backdrop name" %}
             | "size" {% id %}
             | "volume" {% id %}
             | "_" {% ({data}) => "" %}

m_backdrop -> jpart {% id %}
            | "_" {% ({data}) => "" %}

m_broadcast -> jpart {% id %}
             | "_" {% ({data}) => "" %}

m_costume -> jpart {% id %}
           | "_" {% ({data}) => "" %}

m_effect -> "color" {% id %}
          | "fisheye" {% id %}
          | "whirl" {% id %}
          | "pixelate" {% id %}
          | "mosaic" {% id %}
          | "brightness" {% id %}
          | "ghost" {% id %}
          | "_" {% ({data}) => "" %}

m_key -> "space" {% id %}
       | "up" __ "arrow" {% ({data}) => "up arrow" %}
       | "down" __ "arrow" {% ({data}) => "down arrow" %}
       | "right" __ "arrow" {% ({data}) => "right arrow" %}
       | "left" __ "arrow" {% ({data}) => "left arrow" %}
       | "any" {% id %}
       | [a-z0-9] {% id %}
       | "_" {% ({data}) => "" %}

m_list -> ListName {% id %}
        | "_" {% ({data}) => "" %}

m_location -> jpart {% id %}
            | "mouse-pointer" {% ({data}) => "_mouse_" %}
            | "random" __ "position" {% ({data}) => "_random_" %}
            | "_" {% ({data}) => "" %}

m_mathOp -> "abs" {% id %}
          | "floor" {% id %}
          | "ceiling" {% id %}
          | "sqrt" {% id %}
          | "sin" {% id %}
          | "cos" {% id %}
          | "tan" {% id %}
          | "asin" {% id %}
          | "acos" {% id %}
          | "atan" {% id %}
          | "ln" {% id %}
          | "log" {% id %}
          | "e" _ "^" {% ({data}) => "e ^" %}
          | "10" _ "^" {% ({data}) => "10 ^" %}
          | "_" {% ({data}) => "" %}

m_rotationStyle -> "left-right" {% id %}
                 | "don't" __ "rotate" {% ({data}) => "don't rotate" %}
                 | "all" __ "around" {% ({data}) => "all around" %}
                 | "_" {% ({data}) => "" %}

m_scene -> jpart {% id %}
         | "_" {% ({data}) => "" %}

m_sound -> jpart {% id %}
         | "_" {% ({data}) => "" %}

m_spriteOnly -> jpart {% id %}
              | "myself" {% ({data}) => "_myself_" %}
              | "_" {% ({data}) => "" %}

m_spriteOrMouse -> jpart {% id %}
                 | "mouse-pointer" {% ({data}) => "_mouse_" %}
                 | "_" {% ({data}) => "" %}

m_spriteOrStage -> jpart {% id %}
                 | "Stage" {% ({data}) => "_stage_" %}
                 | "_" {% ({data}) => "" %}

m_stageOrThis -> "Stage" {% ({data}) => "_stage_" %}
               | "this" __ "sprite" {% ({data}) => "this sprite" %}
               | "_" {% ({data}) => "" %}

m_stop -> "all" {% id %}
        | "this" __ "script" {% ({data}) => "this script" %}
        | "other" __ "scripts" __ "in" __ "sprite" {% ({data}) => "other scripts in sprite" %}
        | "_" {% ({data}) => "" %}

m_timeAndDate -> "year" {% id %}
               | "month" {% id %}
               | "date" {% id %}
               | "day" __ "of" __ "week" {% ({data}) => "day of week" %}
               | "hour" {% id %}
               | "minute" {% id %}
               | "second" {% id %}
               | "_" {% ({data}) => "" %}

m_touching -> jpart {% id %}
            | "mouse-pointer" {% ({data}) => "_mouse_" %}
            | "edge" {% ({data}) => "_edge_" %}
            | "_" {% ({data}) => "" %}

m_triggerSensor -> "loudness" {% id %}
                 | "timer" {% id %}
                 | "video" __ "motion" {% ({data}) => "video motion" %}
                 | "_" {% ({data}) => "" %}

m_var -> VariableName {% id %}
       | "_" {% ({data}) => "" %}

m_varName -> VariableName {% id %}
           | "_" {% ({data}) => "" %}

m_videoMotionType -> "motion" {% id %}
                   | "direction" {% id %}
                   | "_" {% ({data}) => "" %}

m_videoState -> "off" {% id %}
              | "on" {% id %}
              | "on-flipped" {% id %}
              | "_" {% ({data}) => "" %}

d_direction -> n {% id %}

d_drum -> n {% id %}

d_instrument -> n {% id %}

d_listDeleteItem -> "last" {% id %}
                  | "all" {% id %}
                  | n {% id %}

d_listItem -> "last" {% id %}
            | "random" {% id %}
            | n {% id %}

d_note -> n {% id %}

m_attribute -> jpart {% id %}

block -> "move" __ n __ "steps" {% ({data}) => ["forward:", data[2]] %}
       | "turn" __ _turnRight __ n __ "degrees" {% ({data}) => ["turnRight:", data[2], data[4]] %}
       | "turn" __ _turnLeft __ n __ "degrees" {% ({data}) => ["turnLeft:", data[2], data[4]] %}
       | "point" __ "in" __ "direction" __ d_direction {% ({data}) => ["heading:", data[6]] %}
       | "point" __ "towards" __ m_spriteOrMouse {% ({data}) => ["pointTowards:", data[4]] %}
       | "go" __ "to" __ "x:" __ n __ "y:" __ n {% ({data}) => ["gotoX:y:", data[6], data[10]] %}
       | "go" __ "to" __ m_location {% ({data}) => ["gotoSpriteOrMouse:", data[4]] %}
       | "glide" __ n __ "secs" __ "to" __ "x:" __ n __ "y:" __ n {% ({data}) => ["glideSecs:toX:y:elapsed:from:", data[2], data[10], data[14]] %}
       | "change" __ "x" __ "by" __ n {% ({data}) => ["changeXposBy:", data[6]] %}
       | "set" __ "x" __ "to" __ n {% ({data}) => ["xpos:", data[6]] %}
       | "change" __ "y" __ "by" __ n {% ({data}) => ["changeYposBy:", data[6]] %}
       | "set" __ "y" __ "to" __ n {% ({data}) => ["ypos:", data[6]] %}
       | "set" __ "rotation" __ "style" __ m_rotationStyle {% ({data}) => ["setRotationStyle", data[6]] %}
       | "say" __ sb __ "for" __ n __ "secs" {% ({data}) => ["say:duration:elapsed:from:", data[2], data[6]] %}
       | "say" __ sb {% ({data}) => ["say:", data[2]] %}
       | "think" __ sb __ "for" __ n __ "secs" {% ({data}) => ["think:duration:elapsed:from:", data[2], data[6]] %}
       | "think" __ sb {% ({data}) => ["think:", data[2]] %}
       | "show" {% ({data}) => ["show"] %}
       | "hide" {% ({data}) => ["hide"] %}
       | "switch" __ "costume" __ "to" __ m_costume {% ({data}) => ["lookLike:", data[6]] %}
       | "next" __ "costume" {% ({data}) => ["nextCostume"] %}
       | "next" __ "backdrop" {% ({data}) => ["nextScene"] %}
       | "switch" __ "backdrop" __ "to" __ m_backdrop {% ({data}) => ["startScene", data[6]] %}
       | "switch" __ "backdrop" __ "to" __ m_backdrop __ "and" __ "wait" {% ({data}) => ["startSceneAndWait", data[6]] %}
       | "change" __ m_effect __ "effect" __ "by" __ n {% ({data}) => ["changeGraphicEffect:by:", data[2], data[8]] %}
       | "set" __ m_effect __ "effect" __ "to" __ n {% ({data}) => ["setGraphicEffect:to:", data[2], data[8]] %}
       | "clear" __ "graphic" __ "effects" {% ({data}) => ["filterReset"] %}
       | "change" __ "size" __ "by" __ n {% ({data}) => ["changeSizeBy:", data[6]] %}
       | "set" __ "size" __ "to" __ n __ "%" {% ({data}) => ["setSizeTo:", data[6]] %}
       | "go" __ "to" __ "front" {% ({data}) => ["comeToFront"] %}
       | "go" __ "back" __ n __ "layers" {% ({data}) => ["goBackByLayers:", data[4]] %}
       | "play" __ "sound" __ m_sound {% ({data}) => ["playSound:", data[4]] %}
       | "play" __ "sound" __ m_sound __ "until" __ "done" {% ({data}) => ["doPlaySoundAndWait", data[4]] %}
       | "stop" __ "all" __ "sounds" {% ({data}) => ["stopAllSounds"] %}
       | "play" __ "drum" __ d_drum __ "for" __ n __ "beats" {% ({data}) => ["playDrum", data[4], data[8]] %}
       | "rest" __ "for" __ n __ "beats" {% ({data}) => ["rest:elapsed:from:", data[4]] %}
       | "play" __ "note" __ d_note __ "for" __ n __ "beats" {% ({data}) => ["noteOn:duration:elapsed:from:", data[4], data[8]] %}
       | "set" __ "instrument" __ "to" __ d_instrument {% ({data}) => ["instrument:", data[6]] %}
       | "change" __ "volume" __ "by" __ n {% ({data}) => ["changeVolumeBy:", data[6]] %}
       | "set" __ "volume" __ "to" __ n __ "%" {% ({data}) => ["setVolumeTo:", data[6]] %}
       | "change" __ "tempo" __ "by" __ n {% ({data}) => ["changeTempoBy:", data[6]] %}
       | "set" __ "tempo" __ "to" __ n __ "bpm" {% ({data}) => ["setTempoTo:", data[6]] %}
       | "clear" {% ({data}) => ["clearPenTrails"] %}
       | "stamp" {% ({data}) => ["stampCostume"] %}
       | "pen" __ "down" {% ({data}) => ["putPenDown"] %}
       | "pen" __ "up" {% ({data}) => ["putPenUp"] %}
       | "set" __ "pen" __ "color" __ "to" __ c {% ({data}) => ["penColor:", data[8]] %}
       | "change" __ "pen" __ "hue" __ "by" __ n {% ({data}) => ["changePenHueBy:", data[8]] %}
       | "set" __ "pen" __ "hue" __ "to" __ n {% ({data}) => ["setPenHueTo:", data[8]] %}
       | "change" __ "pen" __ "shade" __ "by" __ n {% ({data}) => ["changePenShadeBy:", data[8]] %}
       | "set" __ "pen" __ "shade" __ "to" __ n {% ({data}) => ["setPenShadeTo:", data[8]] %}
       | "change" __ "pen" __ "size" __ "by" __ n {% ({data}) => ["changePenSizeBy:", data[8]] %}
       | "set" __ "pen" __ "size" __ "to" __ n {% ({data}) => ["penSize:", data[8]] %}
       | "when" __ _greenFlag __ "clicked" {% ({data}) => ["whenGreenFlag", data[2]] %}
       | "when" __ m_key __ "key" __ "pressed" {% ({data}) => ["whenKeyPressed", data[2]] %}
       | "when" __ "this" __ "sprite" __ "clicked" {% ({data}) => ["whenClicked"] %}
       | "when" __ "backdrop" __ "switches" __ "to" __ m_backdrop {% ({data}) => ["whenSceneStarts", data[8]] %}
       | "when" __ m_triggerSensor __ ">" __ n {% ({data}) => ["whenSensorGreaterThan", data[2], data[6]] %}
       | "when" __ "I" __ "receive" __ m_broadcast {% ({data}) => ["whenIReceive", data[6]] %}
       | "broadcast" __ m_broadcast {% ({data}) => ["broadcast:", data[2]] %}
       | "broadcast" __ m_broadcast __ "and" __ "wait" {% ({data}) => ["doBroadcastAndWait", data[2]] %}
       | "wait" __ n __ "secs" {% ({data}) => ["wait:elapsed:from:", data[2]] %}
       | "repeat" __ n {% ({data}) => ["doRepeat", data[2]] %}
       | "forever" {% ({data}) => ["doForever"] %}
       | "if" __ b __ "then" {% ({data}) => ["doIfElse", data[2]] %}
       | "wait" __ "until" __ b {% ({data}) => ["doWaitUntil", data[4]] %}
       | "repeat" __ "until" __ b {% ({data}) => ["doUntil", data[4]] %}
       | "stop" __ m_stop {% ({data}) => ["stopScripts", data[2]] %}
       | "when" __ "I" __ "start" __ "as" __ "a" __ "clone" {% ({data}) => ["whenCloned"] %}
       | "create" __ "clone" __ "of" __ m_spriteOnly {% ({data}) => ["createCloneOf", data[6]] %}
       | "delete" __ "this" __ "clone" {% ({data}) => ["deleteClone"] %}
       | "ask" __ sb __ "and" __ "wait" {% ({data}) => ["doAsk", data[2]] %}
       | "turn" __ "video" __ m_videoState {% ({data}) => ["setVideoState", data[4]] %}
       | "set" __ "video" __ "transparency" __ "to" __ n __ "%" {% ({data}) => ["setVideoTransparency", data[8]] %}
       | "reset" __ "timer" {% ({data}) => ["timerReset"] %}
       | "set" __ m_var __ "to" __ sb {% ({data}) => ["setVar:to:", data[2], data[6]] %}
       | "change" __ m_var __ "by" __ n {% ({data}) => ["changeVar:by:", data[2], data[6]] %}
       | "show" __ "variable" __ m_var {% ({data}) => ["showVariable:", data[4]] %}
       | "hide" __ "variable" __ m_var {% ({data}) => ["hideVariable:", data[4]] %}
       | "add" __ sb __ "to" __ m_list {% ({data}) => ["append:toList:", data[2], data[6]] %}
       | "delete" __ d_listDeleteItem __ "of" __ m_list {% ({data}) => ["deleteLine:ofList:", data[2], data[6]] %}
       | "if" __ "on" __ "edge," __ "bounce" {% ({data}) => ["bounceOffEdge"] %}
       | "insert" __ sb __ "at" __ d_listItem __ "of" __ m_list {% ({data}) => ["insert:at:ofList:", data[2], data[6], data[10]] %}
       | "replace" __ "item" __ d_listItem __ "of" __ m_list __ "with" __ sb {% ({data}) => ["setLine:ofList:to:", data[4], data[8], data[12]] %}
       | "show" __ "list" __ m_list {% ({data}) => ["showList:", data[4]] %}
       | "hide" __ "list" __ m_list {% ({data}) => ["hideList:", data[4]] %}

simple_reporter -> "x" __ "position" {% ({data}) => ["xpos"] %}
                 | "y" __ "position" {% ({data}) => ["ypos"] %}
                 | "direction" {% ({data}) => ["heading"] %}
                 | "costume" __ "#" {% ({data}) => ["costumeIndex"] %}
                 | "size" {% ({data}) => ["scale"] %}
                 | "backdrop" __ "name" {% ({data}) => ["sceneName"] %}
                 | "backdrop" __ "#" {% ({data}) => ["backgroundIndex"] %}
                 | "volume" {% ({data}) => ["volume"] %}
                 | "tempo" {% ({data}) => ["tempo"] %}

simple_predicate -> "touching" __ m_touching _ "?" {% ({data}) => ["touching:", data[2]] %}

simple_reporter -> "answer" {% ({data}) => ["answer"] %}

simple_predicate -> "key" __ m_key __ "pressed" _ "?" {% ({data}) => ["keyPressed:", data[2]] %}
                  | "mouse" __ "down" _ "?" {% ({data}) => ["mousePressed"] %}

simple_reporter -> "mouse" __ "x" {% ({data}) => ["mouseX"] %}
                 | "mouse" __ "y" {% ({data}) => ["mouseY"] %}
                 | "loudness" {% ({data}) => ["soundLevel"] %}
                 | "video" __ m_videoMotionType __ "on" __ m_stageOrThis {% ({data}) => ["senseVideoMotion", data[2], data[6]] %}
                 | "timer" {% ({data}) => ["timer"] %}
                 | "current" __ m_timeAndDate {% ({data}) => ["timeAndDate", data[2]] %}
                 | "days" __ "since" __ number {% ({data}) => ["timestamp", data[4]] %}
                 | "username" {% ({data}) => ["getUserName"] %}
                 | "item" __ d_listItem __ "of" __ m_list {% ({data}) => ["getLine:ofList:", data[2], data[6]] %}
                 | "length" __ "of" __ m_list {% ({data}) => ["lineCountOfList:", data[4]] %}

simple_reporter -> VariableName {% ({data}) => ['readVariable', data[0]] %}

block -> "else" {% ({data}) => ["else"] %}
       | "end" {% ({data}) => ["end"] %}
       | "..." {% ({data}) => ["ellips"] %}


_ -> [ ]:* {% ({data}) => null %}
__ -> [ ]:+ {% ({data}) => null %}

string -> "'hello'"             {% ({data}) => 'hello' %}
number -> digits                {% ({data}) => parseInt(data[0]) %}
number -> digits [.] digits     {% ({data}) => parseFloat(data.join('')) %}

digits -> [0-9]:+   {% ({data}) => data[0].join('') %}

color -> [#] [0-9a-z] [0-9a-z] [0-9a-z] [0-9a-z] [0-9a-z] [0-9a-z]
       | [#] [0-9a-z] [0-9a-z] [0-9a-z]

VariableName -> "foo" {% id %}
ListName -> "list" {% id %}

