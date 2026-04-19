import { useState, useRef, useEffect } from "react";
import {
  sbSignUp, sbSignIn, sbSignInGoogle, sbSignOut,
  sbGetSessionFromHash, sbRefreshToken,
  sbUpsertData, sbLoadData, sbDeleteAccount
} from "./supabase.js";

const RED     = "#C41E2A";
const RED_DIM  = "#9A1620";
const BLACK    = "#0D0D0D";
const WHITE    = "#F5F4F2";

// Theme colors — updated by applyTheme() when dark mode toggles
let BG     = "#E8E6E2";
let CARD   = "#F5F4F2";
let CARD2  = "#DDDBD7";
let BORDER = "#C8C5BF";
let TEXT   = "#111111";
let MUTED  = "#888480";

const LIGHT_THEME = { BG:"#E8E6E2", CARD:"#F5F4F2", CARD2:"#DDDBD7", BORDER:"#C8C5BF", TEXT:"#111111", MUTED:"#888480" };
const DARK_THEME  = { BG:"#0D0D0D", CARD:"#1A1A1A", CARD2:"#242424", BORDER:"#333333", TEXT:"#F5F4F2", MUTED:"#888480" };

function applyTheme(dark) {
  const t = dark ? DARK_THEME : LIGHT_THEME;
  BG = t.BG; CARD = t.CARD; CARD2 = t.CARD2; BORDER = t.BORDER; TEXT = t.TEXT; MUTED = t.MUTED;
}
const TENJIKU_IMG = "data:image/png;base64,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jEgg8APNR/tH6YoL47ROgrpuZt05pe1S4ENT7yHFuymlL4QnmOHHQk+PlmscdjfaTW+19z1M1qZbKIknu0RksuhaXVDOVjy5HHOtkgAOlKD5WQlJUrmACTUHYFBbbjiRhClkp+VSV1lIjRV+8C4RhKc8yapLOwWIiUHrigrKUpQKUpQUN7OLe7/dNV1oObXGP/dioy98TgajJB/erCeXzqbaQlptKEjCUgAcqC2df7f6O13BEXVdijXJtHNClgpcRj8K0kKH51q92udN7R7X7Z/0Z0/peCxfrw4FsOc3HWW0EFS+NRJA6ADIzk+VbX621RZtH6amahv0tMWBERxuLIySfBIHiSeQFa6bObaTN0ta3Hd7dG399ElEiy2ySkFIj8+FS0nwAxgeOSaC0v2b0e3IkasuDzjSZiEMtoCljIb94k4645DnUtddOao7QO+kfVEB2XatFafd7iJcEnhU+UKystefEofF0AFWFthsU3uJp3XN705c12u8wL0/Ht0dDhSyUJOeBRHMA5AB8MVmfs870zn9WwdpdWaURpu5QoJbQoe4l51HglGOQKQTnJyaDYt55mHCXIkOhtllsrcccVgJSBzJPhyGa0FjamuG7XbQtd3sgW5EjTkJjqTyCYzPVR9DzP1FZP7bG8063uO7V6VSpc6c0EXB9o8Sghf+5SBz4lA8/Q1e/ZA2Yb240p9vXZri1HdmUl4KRgxW+oaHr0J9aDPdec+/so7g9rddsZS8toXGPbUhHNXCggKI+vEa303M1VA0VoS76muTqW2YMVa0gn414whA9SrA+taH9jyyv687RX2/cFun2FTt0eWkci4Ve6CfDmr9KD0RjthmO20kYShISPoKitSAqVEQFci7kjz5VM1BXQ99fWW+Hk0jOfmaCQbGEAV9UxgClApSlApSlApSlApSlAronOBuMtfkK76orzn2BzH4TQd+nmS3bkrUDxuHjVmquZJjw4rsqU82ywyguOuLUAlCQMkknoAK+LV/s2P/AMMVjrfvRuqNwLXA0jaZzdtsc14m9ywr973KcENoT4lR/lQac7iXK5doPfkhqS7H0vEfENub3ZLMRjixxqI5ArPMZPlW+2htMWbR+loOnrDDbiwYrQShKB8asc1HzJPMn1qAs+itObc7WXGy6ft7TcRiE645xgFT6w2cqWfEmsIdjrfBu7afGhtQSwq9Rnw1bC4olUltSjhHIfcGefkKDJW92yTu6s9BumubzAtjSQG7dGbR3IV4qOeaifXpUDpXsk7T2ctuXCLcb26lICva5JShSvPhRj8s4rP4rmg0C7Qul7Zsn2jdN6i09EMGzPramoZbUQlBSvhdSD4DGDj1rfWBJamQ2JjCuJp9tLravNKhkH8jWD+21oA6z2kduERriuNiUZjPCjKlt4w4n8sH/lqh7C+v2NT7UtabkyFrulhPcrDiiVKZJJQRnwA936UGwxq2bpbtQuyXXEXEKj8WW2k+6QPnU9cpsa3wXZst5DLDSeJa1nASPWu8EEZHjQW3a2ULePtPGZCeRC+oqaHIcqoL2juLhGlJ5cZ4FetVyTlINBzSlKBSlKCMmn/3xCH/AHlTijgVC3UKbfYlJGe7WCflUuy82+2FtLCgfEGgxZd9D3DcrV0e6awDsbS1qf4oFjWnBlOpP8Z8eKeXuo8sE9aydMQhi1vNtIShCGFJQlIwAAnkBVSBVr7suXZrbXUbtjANxTbnjHz+LgP60GCP2fYX/RvWiiDwm9Hr54Of8qu/tPahs+mYEdyz6cZuuv7iCzZ1R4odlM4/3oIBUAnPL1NY5/ZwSpC9Pauiuj3UzWnDkc+IpIOfyratFqtyLmu6JhMCctAQqRwDvCkdE8XXHpQaU2zY3cLQUBveq6ym71qW2vpuL9pcQp1TqD8fErrxgEnkOWPSs37e9qHa7UltL11u6dOTEAd5Hn+6CcfdUOShWcVoCklJGQeRB8RWi/a/7PMuyXORrfREAvWiQormwmUkqjLPMrSB9w5PyoIPtjb6xdxJrWldLvKXp6E7xuPjkJbg5AgfhHh51nrsI7eDSu2Tmp5rKkXLUBS5hacFDCc8AHjzyT+VYA7L/Z2vOtb1F1BqyC/A00woO8DqShyYR0SkdQnOMny6V6DRI7MWK1GjtpaZaQEIQkYCUgYAFB2kgDJ6CoC3D2i4SZRIUFL4Un0FVepLgiBb1ZUAt08CB86i4EwojJZiMLdV/ZHKgnScda+FuoT8SgKj0xbvJx3im46D155NVCLGyoZfkPOnOeuBQcuT4qPidSPrVO5eYqRlKuIeGBnNV7Vpt7ZJTGQc9eLnVS3GYbTwoZbSnyCRQQirqs4CIrxz09w19mTcs8re7U7ilBALuEtkjvoLwz0wnNDdkoHE6w6hPmpBFT9cKSlQwpII9RQQrV2iK6rAz58qqETI6xycT+dVjsOK6oKcjtqI801SrstvVxEM8JV4pJFB2JWhXwqBrrmN96wpBHUVTuWVSAPZJbjePBfMV1KTd4ysKZS+gfeQf8qCpsUpAYEN1RS63yAV94elStWhdZMZxhRdSpl5IyM8iKuKyuqftMZ1auIqbBJoLa3vuKrXtFqmchYQpu2PcJJxglJH+daL9hKySLtv3CuCUr7m1xnpDqgOWSkoAPzKv0rantqWTVd82WlMaYWVIafD1wZT8T0dIJIHyODjxxWL/wBm/p0N23UuqFpHE443Db65wBxK/mKDcBPKgUCSARkdRQ8qtGLKcj6kkzvfVHdX3akk9Mcs0F1yGW5DDjDyEuNOJKVpUMhQPIg1oZqOLc+zF2jWrvAbdd0tdFqKUZwlxhZ95v8AvIJBHyFb7JIKQQcg+NY/302vsu6ejHrLcgGZbYK4UxKcrYc/+xwMjyoLM7W2tIcLs6y7nb5IdbvHctRnG1Z4krIV1HoDWWtC3JF50XZLu2hTaZsBh8JV1HEgHH615YbkWzV+lbw7ojU0uXi1OFLcdbylNJB6KQM4AI8q9GOyleRe9gdKSC+HnWIYiuHxSWyU4PyAFBfupgs28LTj3FhR+VdsY8TKT6V86j/2Q99P51xB/wBVR8qDvpSlApSlB8uIS4kpUMg1Hv2sDiUw6tkn8KsVJUoKDTTjrZfhvvKcUhWUFRycVMqSFJIUMgjBBqFlsPNSRLi47wciD0Ir7TelIKUvw3QfvKTzAoKHQ2htMaJTck6atqIKbjKVKlYUTxOHqRnoPQchVyOuIabU44oJQkZJPhUW5fI4Tlph91WenDiqeU7KuaQz3RZYPx56qoJiHJYlsJejuBxtXQiu1SUqSUqSCD1BFW8mA5BHHBd7rA5p6pNU5vd3TMSw1FalHoQnl+tBdKEJQAEpCQBgAdBXNfLZUUJKhhRAyM9DX1QUc+2wp7jS5bKXS0coBPLnVU0220gIbQlCR0AGK5UQEkkgADJJ8KxPuT2hNstCuvxZ97E64MgExIKe9WSegyPdHTxNBlmuqTIYjNqckPNsoSMqUtQSAPMk1oZuV2xNZXsGNpC3s6dj5P75Sg++oeHMgBP5fWsPS9Qbnbq332Vy43q/S3sJ7hC1FA5/hHugUHopqHe/amw8Pt+ubOolRQEx3u/II65DecfWseXfte7ZR3Et2qPerutSynDMXh+vvHnmsXbT9jeZMZZuOv7qqGlWFewRMKXjyUvoPpW0Oh9qdA6OjtNWTTUFpxsAd+40Fun1KjzoMUW/tFa1vS1mwbL6glMnPdOLUUgjwJ92qiFuZ2iXlcS9mIyEEcgqbwn08a2FQhCEhKEpSB0AGK+qDAMLc7fplR+0tky8kH/6ackHH1zVVH3w1nFLir9stqmM2kclRuF7n64rOlMCgwzB7SGggppu+xb9p51aSpXt9tcShHoVJBq8dL7q7d6mdSzZNZWeW8oZDXtAQ50/CrBq7JlvgzGy3Lhx30nqHGwrP51YOr9kdstTNue3aVhMvL/38ZHdLB88poMitrSsBSFBSSMgg5r6xWAHtitW6WjL/wBGe6F7tiRzRDuCvaGflz6flX2xuZuzod9uNuRoD7UtyQEm7WFRcJ8CpTR/Plj5UGdZUOLKQUSGG3AfxCuxlptlpLTSAhCRhKR0AqzNv909Ea4CkWG+MrlI5ORH/wB0+g46FCsH8qvYUHy62262pt1CVoUCFJUMgg9QRUPo/Stg0jbXbbp22tW+I7IckqabzjvFnKjzPLn4dB4VNVwo8KScZwM486DouLyY8Nx1R6JOPnUNb4KV27gWOaxnn61Tie7dZimXkdw02rk2r4j61OoSEpAHhQUNnmLZeFukg8Q/hrPiPKprHKomfDEhPEk8Lg5pI6iuuPdH4wKJ7alY6LQOvzoIDdbanRW5dtTE1Pakuuo5tS2TwPtn0WOePQ5HpUjtfoey7eaQjaXsHtBgsKUsKfXxrUpRySTUwLxb8Al8D0INFXm3hJIf4j5JSc0HzqQj7KcSTgqIA/OuYQxHT8qopDy7o82lLSkMIOfe6qNSSRwpAoOaUpQKUpQKUpQK+ShJ6pB+lfVKD4DSB0QK4dcQy2VKIAFH3UNNlSjjFRrDL91f4l5REHj+P/pQco9quiyGSWo/i55/KpeBCYhNcDKeZ5lR6k13NNpaQlttISlIwAK6bjPh22E7NnyWosZlJU466sJQgeZJoKnp41jLebevRG2MNQu9xRJui0ks26MeN1ZHTix8A9VVgPtD9rIIW/p3bJSFgpKH7utPwnOCGkn/ANR+g8a06uU+ZcZrs2fJekynlcTjrqypSz5kmgzRvR2lddbgoVAhvr0/aFDCo0N1QW6P7axgkegwKwg4tbiipSipROSSck185rIuwm1d33U1gi1QssQmcLmyinIaRn+Z8KCp2J2Z1NupeO6t7Ri2tkj2mc4PcQPJPmqvQ7aDa3S+2Wnm7XYoaC8eciWtILryvMnwHpU3oDSNl0TpeHp6wxQxDjICR+JZ8VKPiTVwCgDlSlKBSlKBSlKBSlKBXC0hQwRkVzSgxbuhsZojXTqbg7FctF4b5t3C3K7lwH1xyV9astq7bx7QBuPfYruv9LNrwZ7AzPjt5+8Pv4H/APtbDV8qSFAggEHzoLV253B0nr62Kn6Zurcnuzh9hQKHmT5LQfeFXXyNYb3G2Phz72rWOhLk9pfVSDxh6PyZkH8LiOhBro0HvQ/AvCNHbtW9GmdRcQQxJyfY53QcSFn4ST4UGXrhbWJfv47t0cwtPI/Wo5iTIhvezzU4ycJX4KqeSoLAKTkEZFdMyK1LYLTqcg9D4g+YoOpKgoZBzmuFoSoYUAfmKjGXXrdI9llHKCfcX4EVKJIUMg8qDpVEjk57tP5UERgHIbTn5V30oOEpSnoMVzSlApSlApSlApSlAr5cWlCSpRxXJOBmouSty4TRDYzwD+KoHoKDhppy7vkqJTDSeZB+P0qebbQ02lCEhKUjAAriMw1HZS00gJQkchVHqG8W+w2WVd7rKbiw4ranHXFnAAAz+fpQdWq9Q2jS9hl3y+zmYUCI2XHXXFYwB4DzJ8B41549pTtCXzc59VmtneW3TLTpUhgHC5BHRTh8R4hPQVHdpfe+77q6gXHjlyFpuK4RDiZ5uY5d45/aPl4VhwkmgE5rilKCptkKTcbhHgw2VvSH3EttNoGSpROABXp/2bNs4e2m3ES2hlP2nKSH572OanCPh+Q6fnWp3YG0CzqLcR/VFwYDkSyIBZChyL6vh/IZNegOBQAKUpQKVbe4WttP6DsRvWpJaosLjDYWEFRKj0GBWEr92xds4IULfEu9yWOnA0Gx+ajQbImuFKSkZUQB5mtGtYdtTUsrja0zpmDb0HOHJSy6v8hgViG+bv7vbhXFNv8At+5yHXzwohwQUBXoEp50HonrTdDQOjmFu6g1Rboqk/7oOhbh9OFOTWJXe2FtWiQttLd4WlKiAtMbkoeY51qvpbs77u6ruakP2KRBBwXJNwXwjn88kmspW7sSagcZSqfrW3sr+8luKpePrkUGb9IdqTa3Umoo1kYmTYjsk8LbspgobKz0TnzNZxScgEYwRkVq/oTscaUss+NcLzqK43J+O4lxKGkhlHEk59TWzzLYabS2nOEgAZ9BQfdKUoFKUoFWluft7pjcLT7lp1Fb0PpIPcvAYdYV4KQrqDV20oNddOax1ZsvfoWjtxVruWknlBi16iOSWfwtvn06ZrYdh1t5lDzTiXG1pCkrSchQPQg+VRWr9N2fVVhk2S+Qm5cKQgpWhY6eo8j61grTeobzsNqdjRmr33puhJjvd2W7rypUNRPJl0/h8AfCg2GmxWpbBadGQeh8QfMVDMOPwJIiSiVJP8NfgoVPNLQ62lxtQWhQBSoHIIPjVPcobc2OWl5BBylQ6g0HAIKQRSo22SHErVFkApcRy5+PrUlQKUpQKUpQKUpQKUr5dWENqUegoKK7SVNoDTKSp1Z4UgedV1qhphxgnkXFc1q8zUfZmTLlruDg91B4Wh/M1OZ8KD5cWltBWtQSlIySegFee/bJ3vXr29r0hp9//wCHba/lbg5GU8nIKs+KBzx+flWZe3PvC7pqy/0AsEjgudyZ4pzqOrMc/dBB5KVj8vnWhyjnrQfNKUoFKV2MI711DY6qUB+ZoPR/sP6XRp/Y23zVNhMi7LVLcOOZBOE/oKzrVubY2xNl280/akpA9mtzLZwPEIGauOgUpSgo7vbbfdoLkG5wo8yM6MLafbC0qHyNa57r9kbRuoi5N0k8dPzVEnugCthR/u9U/StmKoL/AHm2WK1PXS7zmIUNhPE488rhSkfOg051T2RrVpba6+32XfpNxvEKEt9lDSAhoKTzxjqeWa1NsF3uVgvEe7WiY7DmxlhbTzasKSRW2e+3azjT2rvpbSFoYm22THVHVcH1KSVcQwSlPl8609J4iSaD1Y2J1XM1Ts9YdTXx9oSpMULkO8kpJHIn06V2Tt3ts4M8QZWt7KiQVcPAJKTg+uOlebJ3B17dNLQNERLrNVa4ye7ZhRQRx5Pjw81dav8A2q7MO4ms3mpVyi/YNuUQVPyx+8Kf7KOufnQejMCXFnxG5cKQ1Ijup4m3GlhSVDzBHWqirZ2x0jG0Loi26WiS35bMFrgS89jiV4+HSrmoFKUoFKUoFKUoFQWutK2fWWmZmn75FRIhymyggjmg+CknwI86naUGv+z2r75oXcA7N65dU6yhof0eujmf602M/ulK6FQHIfL5VsAax/vhoBvXek1MRl+zXqCr2m1y08lMvJ5jn1wcAGo7s87jSNc6afh35lEPVFmeMS6xhy99JwHADzAVj86C/L7EUpKZjA/fNdQPvJ8q+oEhMhhK0nw51JHBGPOoBSBbrr3achh73k+h8qCVpTOedKBSlKBSlKBUbeXFL4IjXxunHLwqRUQEknwqPs6DJuj0tXwte4ketBLw2UR4yGUD3UJxVu7p6uhaF0HdtUTloCITBUhKj/Ec6JT9TirmJx61ol+0A3Hk3XWUfQVvmEW22oDsxtB5OSFcxxf3R/6jQa3az1HctV6ouOobu+t6bOfU64onOM9Ej0A5AeVQ1DSgUpSgVJ6WbQ7qW2NrGUqltBXy4hUZVTbX1RrhGkJOFNOpWD6gg0HsNa0hNujJT0DSQPlgVU1F6Tlon6XtU1tQUh+G04CPEFAP+dSlApSlAq29ydIWvXOjbhpq7ozGltlPEBzQrqFD1B51clKDzJ1l2c9z7BMvKhYVybbbONZnJcSEONp58Qyc9PCsPYwSK9U+0ddo9m2R1VMkLCQYC2kZPVSvdA/WvMbRWmrprDU8PT1maDs6YspbSTgZxmg2P/Z66gskfWd003cokQzZrQegvuNpK+JPxIBPTlz+lb2gAV5FWG4XvQWu489tLkO6WiXlSDyIUk4Uk/PmK9R9pNdWrcLQ8DUdrdSoPNgPt595p0D3kny50F30pSgUpSgUpSgUpSgUpSgVr5vdAd2x3Gtu8lkZcEJ91MPUjDY91xlXIOkeaTg59K2DqL1VZIWo9Oz7JcmkuxJrCmXUkeBGP+tBV22ZGuEBidDeQ/HkNpdacSchSSMgj6V03yJ7VCPB/Eb99B+VYc7LF/nwxqDa2/vFdy0pJ7uKpfJTsNX8M+uOmfUVnHrQRVqkCRGST8XQjyqrNRSP6nfHWOiHRxp/zqVoFKUoFKUoKK7v9xEUodeg+dVVjjiNbm0YPEocSs+ZqOuSVSJ0aMnxWCr5Cp4cgMUETrK+w9M6VueoJ7iURrfFW+snx4RkD6nA+teSOqrzM1BqO4Xue6p2TNkLfcUo5OVEnFbzftB9ZKtO3MDSkWRwP3h/jfSOpZb54+RVitBjQKUpQKUpQK5zXFKD1F7KWoE6j2J01KLgW7Hjeyu48FNnh/kBWU601/Z0ayHd3rRMl4ZBEyKlR6+CwP0NblUClKUCuqVIZjR1vyHUNNNpKlrWcJSB1JPhUdqzUdm0rZJF6vs9mFCYTxLccVj6DzJ8q0P7QfaE1JufNc0vouNLi2NSigoZSS/L9TjoPSg++2Vvk3rq5HR+mpJVYIT2XnknlKcHj/dHPFS37PjQj9w1lO1vKYIiW5ssR1qHJTqhzx8h/Ord2c7K+ttWyWJ2pml6ftJIUvvh+/cT5JT4fM1vjoPStm0ZpiHp6xxUsQ4qAlIA5qPionxJoNRO3rtKqJNTuVY4pLD6g3dEoHwqIwlz5HofpWJey3vBJ2u1mETXHF2CesJmtJOeA9A4B5j+VekOp7LA1DYZtlubCXocxlTTqD4g15bb47d3PbXX06wzWlmMFlcN8p911o9CP5UHqfaLlCu1tj3K3SW5MSQgONOoOUqSRyNVledHZu7R9120ZTYL1GcuunyvKUhX72P58B8R6Vu9truvofcCIl7Tt8jvPkZXFcPA8j5pPOgvmlBSgUpSgUpSgUpSgUNKUGBt8YbeiN2dI7pQk9y09IFqvakjktlzkhSvPBNZ3QQpIUCCCMgirM3w0wjV+1l+sfAFOvRVqYz4OJGUkfUVBdlzWjmtdobZImcQuVtH2dOCjzLjQ4eI/MYNBfmo2iGW5aPiZVk8uorujOd4ylY8RVVNa76K41z95JFRFgcJid2rIUjkQfSgkqUpQKUr5XySo+lBQW9Pf31bhzwsowOfianDULptPE/Mf4uq+HHlipeQ4llhx1ZAShJUSegAFB50dvHUJvO/EqAh4rYtERqKlPglRHGv9VfpWAauPcy7O33cG/3h9wOOS7g+6VA8iCs4x6Yq3KBSlKBSlKBSlKC6drNZXDQeurZqe3LIciPArQD/ABEHkpP1Ga9VND6jt+rdK2/UNrdS5FmspdSQfhOOaT6g8q8ghWzvYq3sa0ddF6M1LMKLLOcBiurVyjOnkR/dP86DfulfDLiXW0uIUlSFJCkkHIINfdBj7X20+nde3ZqXq12dcorBBYgF8ojoPmUjqfnU9pPQ+ktKsJa0/p63W4J6FlhIV/i61cdKBSlKBVn7rbc6a3J08qz6jid4gHiaeRycaV5pP+VXhSg0A3f7I+sNOFyfo90ahgA5LIwmQgfLor6Vr9Liah0tdAJEe4WicyrkVJU0tJHka9gCM1Aaq0XpXVUYx9Q2GBcWz/2zQJHyPUUHn5t72pdz9LBpiZPbvsRB/hzRlePLjHOtjduO1/oO+rRF1NFk6eknA7xf71kn+8OY+oqq1h2QNsbwtb1pcuVjdUc4YdC2x/yqB/nWOrp2Inw4TbNboKM8g/F5j8jQbbWLVemr7Dbl2i+2+ay4QEKafSck+HXrU1Wn2kuyBqCx3eHcGtwENGK+h4IbjqwSkgjI4q2+jpWhhCXFBSwkBSgMAnHM0H3SlKBSlKBSlKDhQBSQRkGsB9nhsaX3i3K0OoqQ0ZiLpEbx7pQ4Pex9SKz6elYK1rxWHtcaLuiSG2b5bJNvd5H3lJBWn9QKDOgqChJLF2lMcPCCriSPnU8OlQUwBvUQIJy42CR8qCSpSlArrkHDKj5Cuyqe4K4Yjh9KD40uhIgLcHVx1RNdWvprNu0RfJ0hZQ0xAeWtQ8AEGqvTrYbtLPCSePKjn1qze0hckWnY3VsxaCsC3LbwPNfuj+dB5WyVBchxY6KUSPzrrrk1xQKUpQKUpQKUpQK5Bwc1xSg2+7JvaTj2iJG0Vr2WsRUYbg3BZKuAdAhZ8vI1upClR5kZuTEfbfYdSFIcQrKVA+IIrxuBx0rN2wfaJ1XtmE22QPtixcQ/qryvea8+7V4fI8qD0ppWMNrN89vtwIzSbbeWYs9QHFClLDboPkM9fpWTkniAIwQaDmlKUClKUClKUClKUClKUClKUClKUClKUCsGdqXNuv222pRkewalYQopHvFLnukfzrOdYT7ZKvZtrYd0Ayq33mHISMeIcFBmwdKhL4EousNePeUCD8qlLe97TAjyAMB1pK8fMA1G6kSkORHce8HMA+hoK1JyM1zXy3zQDX1QKpbp/qbn92qqqa4pzEcHpQd9h/2PG/uVjftb/wDy8at/8Kn/ANaayNp9aF2lgJOeFPCfnVk9pe2Lu+xOrYTbgbUbetzJ/sYV/lQeVlK5PWuKBSlKBSlKBSlKBSlKBSlKD7bccacS42tSFpOUqScEVlnQHaI3Q0cw1Ei31c6G3ySxMHegDyyef61iOlBt7YO2zdmkJTe9HxpBA95ceQUZPyINXXG7belC2PadH3hK/EIdbI/U1ovSg34t3bS2/feCZlgvsRHirhQv9AavvTPaZ2ivq0No1H7C6vGETGVN4+vT9a8zKUHsLYr/AGW+MB+z3WHPbIzxMOpX/I1J15CaT1dqXSs9M7T17m259P3mXSAfmOhrZ7aDti3OK4zbtw4KJjGQn2+KnhcT6qT0P0oN3aVA6H1fp3WllReNNXNi4Q1cittXNJ8lDqD86nqBSlKBSlKBSlKBSlKBWFO2mAdjJmevt0XH/wC6KzXWFO2WC/tG3b0Z72bdYjDYAzlRdHhQZfsX+xIH/hm//SKotT/BF/4wqRtrRYt0ZhRyW2koP0AFR+pSCYiOIcRdyB40FWz/AAk/KvquG/4Y+Vc0CuqUMsLHpXbXy4MoUPSgp9L4Fs4QeYcVn051Q7n2/wC1NudRW7vO77+3Po4sZx7hqp0xwpVMaz7wdyR86lZjSH4jzDiQtDiChST4gjGKDxveRwOrRnPCoj9a+KmdcQF2zWN5ty2FMKjTnmi2oYKMLIxUNQKUpQKUpQKUpQKUpQKUpQKUqssrCJN4hx1p40uvoQU5xkFQFBSYNcEYrfPU/Y60Xd1xJVius2yoLaS+xnvUk46gq5jnWr/aN2hl7Ralh2125IuMacyXo7wRwnAOCCPOgxZSlKBQUpQXxtNufqrba+t3LT89aWuIF+ItRLTw8iP869FNg937DutpwTIP9VubAAmQlnKm1eY80nzry0FXRtlrm/bf6ri6hsElTT7KvfbJ9x1PilQ8QaD1vpVk7LbhWzcrQkTUduwhahwSWc82nR1TV7UClKUClKUClKUCsGdrFxcte39haCiu4ani/CMnCFBR5VnM9KwXuayrUPag28soQpbFojyLq/wqxwkJ4UE/8xFBnQdKhb8OK5QvTiqaFQU/hd1ChIJy23zHlmgkU/CK5oKUChFKUEbalBm9vNHADqMj1IqcV0qBlq9nu8Z8kAFXCo486n+tB5sdt7TzNh3/ALq5GSEtXNlqdgJwApScK/8AMkn61g6t3f2jOklyLLYdYR4vF7K4qJKdAJKUq5oz6ZB/OtIzQcUpSgUpSgUpSgVcW3idMu6rhR9Xe1JtDy+7edjqAW0Dy4ufgOtW7XIoNtdXdjiRItLd32/1YxdI7zYdZamI4C4kjIwtORzHpWs2ttJag0ZfHLNqO2vQJiOfAsclDzB8RXpb2WLszeNhdKSG18ZZgpjrz4KR7pH6VYPay2dvm62rdLM2dpqOzGbdE2c5yDaCpOB6nrgUHn5Egy5auGLGefPk2gq/lV57S6Hn6g3QsNgnpdtaZEtHE7IQUAAHiIGR1OOVelWgtCaT0BpSHaoMGC0iIylDkpxtAW4QOalKPmaxdv8Aa+0TMkWXRljet10vtwusdv8AqZStyKkLBK+IdDyxQZ+YbDUdtpJJCEhIJ64FaJftAb0/f91rTpO3R1SXrfEGUtIKlqccOccvTFb4JGEj0q2IGgdJQtVzdVN2aO5epi+J2Y8O8cGAAAkn4RgdBQaKaD7JW5epLcifPXAsTTicoRLUou/VKRy/Oujcjsq6/wBG2WTeVT7RcIEVsuPOIeLZSB6KH+dbJ759pdrbue7aGNIXV2cMhDsxsssK9Un7w+Va0677Um4OrtL3PTs+NaG4VwQptzu2PeSg+AJNBgU9aUpQKUpQZv7IW6j+3u4jMGbJULFdlBmUgn3UKPwr9Mfyr0nacQ42lxCgpCgCkjxHnXjW2ooUFpOCDkGvTTsha6c1zs1bn5bgXPtx9ikHPM8AASo/NOP1oMxUpSgUpSgUpSgHkM1gTZp8ap7Re4uqS4HGLYGrREzz4QOa8ehKRWV9z9RNaU0BetQOqAEKItxOfFWPdH54rH/ZB0y/Y9oo11uLZTdNQPLucpSs8R7w5Rn/AJcfnQZjFQUc99e5TuE4SeAEelTUlwMsOOnolJNQ2n0Ex1PKxlwlXTzoJKlKUClKUFBe2S7EJTnKeYqRtj4kwmnhkZTzB8DXW6kKQU9eVUNhc9nmPwVk8/fbz5eNBQ7s6Tia328vWmJiCpM2KpLZHVLg5oUPkoCvJq6wpNtuUi3zWlMyYzqmnW1dUqScEGvY08+leefbu0ENL7qJ1BCirbgX5svlYT7iXwcLTnwJ5K+p9aDXSlD1pQKUpQKUpQK5HI1xSg307H+6dga2bY0tbIsy46itTLjq7ey3hTwKsgpJ5Y5jNVTm9G+UZcyM/sxKcccWoQ3EOHCAfh4hggkfMVpHt5rPUOg9Ss6g01OMSc0CnixxJUk9UqB6ivQrs377WTcrTzMe6TYcHUrPuyIqlhHe+S2weoPkKDSTeLdfc/VF1l2nVt1kxTHdU27Aay02hQPMEDrj1r67LAmOb8aaVFdjodTJ4lLkDKeEA8X1xnFZk/aHaU09bbrZNS22OyxcritxEzuyP3nCAQojz8M1qdGkPxng7HecZcHRaFFJH1FBuF20N7bk3qSJorRN8XHTHUFTpERzClOE8kBQ8B1NbZ7fpko0PZEzXnHpPsLPeuOHKlK4Rkk+deT2kbXctRatt1qt6XH58yUhDf3iVE9fp1r1L1Lqqz7b7dN3XU05KW4EVtDhHNTqwkDCR4kmgwT+0YvFvj7fWWzLaaXOlzu9QogcSEITzP1JArRA1kztC7rXDdfWhu0hkRYEZJahRx1QjOcnzUfGsZmgUpSgUpSgVtr+zl1IqPqq+6Ydd/dyo4ktIJ+8k4OPoa1KrNXYquJt3aDseVhCJKXGFevEk4H50HpdSlKBSlKBSlU9ymR7fb5E6W6lpiO2pxxajgJSBkmgwr2k5x1Hf9I7WQV947eZ6ZFxQk80RGiCri9Dgj6Vm6My3HjtsMoShttIQhKRgJA5AAVgLs0wpWsdeas3husZwN3F72GyF1PSMjqtOegJwM+hrYDoKCN1E8UQ0x0Z431cAx+tfUNsNR0oHgKoZCjNvZ5ZbjjhHqfGpTGOVApSlApSlAqLuiVR5DU1rqhQ4vUeNSldchoOsqQoZBFBWtLS62lxBBSoZBFWPvroSHuJtrddOyGkqfW0XYa8DLbyQSkg+HPl8jVw2B8srXb3TgpOW8+IqYIz40Hjnd7dLtVzk22ewtiVGdU062sYUlQOCCKpK3H7d+zjqJLm52n4ae4IAvCGweLjJwHseXQGtOcUHFKUoFKUoFKUoFd0SRIjPIejPOMuoOUrQohQPoRXTV3bRajtmlte2673m0xbrbkOcEmPIbC0lCuROD4gc6CFmzr5f5SEypU+5SPhSFrU6r6dayDons/bqarQl6Dpl6Mwro9MPcpx58+f6V6CbaQ9qploavOiLfp32ZwcQdjMthSM88K5ZSaltVbgaI0pEU/fdTWuChI+FchJWfQJBz+lBoxdezdu9t5bm9X2uRFclw8rV7A8e9ZTwnKuYHQZ6VhXU+rNT6ie47/fLhcFDCcPvFQGPQ8q3E357UOgr1t5etOaWk3N+4TmFMNvpY7tCMkZOVc8EZ6Vo+s5OTQcGuKUoFKUoFKUoFZK7MXef6dtJ93nPt6Py8axrWa+xTb/ALQ7Qdi90KTHS6+rPhwpP/Sg9LaUpQKUpQKwV2kr9N1DcrVs9pmSPtW+vD7RUgn+rwwcrKiOmQMVkzdHWlt0Ho2dqK5rHCwjDLf3nnD8KE+ZJqwuznoO8W566bh60CXNU6jUHiCeIxI55oaz06YyPDpQZU0zZoGnrDCstsZDMOEylllA8EgYqpuclMWE46Tg4wn5npVTUDOWqfcxHGCwycn1VQdllYLUcLXzWvmo+tV5rhI4UgeVc0ClKUClKUChpSgjbsy4laJcfk62cj1FStvlIlxkvI8eo8jXWsBSSCOVRSVqtc8rP+qun3xjofOglrxboV3tUq13KOiTDlNKafaWMpWhQwQa8z+0ztDcNrdZvpZYdXp+Y4VW6SRkYPPuyfxJ/WvTpKgpIUDkEZFW3uTo2za70hN03e2EOR5KCEr4AVNLxyWnPQjPWg8jKVkDe7a3UG1+rH7RdY7i4SlkwpwR+7kN+BB8D5jwrH9ApSlApSuQMnAGaDiuQSOlZw2g7M+u9wrO1e0mPZ7Y6f3bsvIU4PxJSOorOulexXpuMUL1HqWbOUPiRGQG0n6nJoNKLdd7tAQtu33KXFS58aWXlICvmAedSFs05qzUT2YNputycUfiQytefrivSjR2we1WluFcHScOQ+no9LHfK/8ANkCr+W5Y7HEAWu322OgeJQ0kfyoPMSDsTuzMSlTOibpwq5grbCf5mq1/s7bwNRw8rRsxQP3UqSVD6Zrf2/b3bVWNZbn63tIWDgoad7w5/wCUGre/9pzZkuFH9Kx8/ZnMfyoNTND9k7c7ULSnrizGsLfCSkS1ZWo+XCnpVq7hdn/c3RZcdnWB6ZER/wDUwh3qMeZxzFb92HfLai9Opag63tXeK6Jdc7o/+bFX3AuNtuTPeQZsWW0R8TTqVg/lQeO7rS2nFNutqbWk4UlQwQa66zl224lmh773JFoZQ0VstrkhGOHvSOZAHSsG0ClKUCttf2cum1P6pvuqHG/3caOmM0oj7yjk4+grUxtJWoJSCSTgADrXpr2Q9CuaG2at0eYgIn3EmbIGMFJX8KT8higzDSlKBVJd7jDtNtkXG4SG48WO2XHXFnASkcya7J8uNBiOS5b6GGGklbji1YSkDqSa10usm7donU7lmtrkqBttbngZU1KSk3VaVc20HxT1z1oOdJQLtvnue1re8NPM6As6+KyRVEBM19KsF1SfIY/QVsgAAAAOlUtmtsG0WqNbLbFaiw4zYbZabThKEgYAFdsuQ1FjqeeVhKRQU16mezRi2g5ec5JA6/Oqe1RRHjjPNZ5qNU8NtcyWuc+OvJsEfCKlB0xQKUpQKUpQKUpQKUpQK6pLKH2ihQzmu2lBGQJTtvkCJKJUyo4bX+H0NT1Rk2KiS0UKHyPlVNAuDkNz2aer3OjbmOvoaCN3U2/07uPpR/T2ooxcZX7zLzfJxheOS0HwP6GvOPfTZrVO1l4W3co65NpcdKIlxQn3HR1AP4VY8D616kggjINQ+tNMWbWGnJen7/DblwJSOFxtQ6HwUD4EHmDQeQNcVsV2hezJqDQPHedMe0X2xFSlLCG8vRR4cYHxDH3hWu6kkEgggjqPKg+a+m1KQsLScKByD5V80oN2Ozd2p7Wq2wtK6/KILrCEMRrggHu1gDA7weB9elZK3G7Um2mlEuMwpi7/ADEjk1C+DPqs8q83gcUJz50Gxe4Pa63GvynGLCmJp+IrkO5Txu4/vnx+QrB+odW6l1BIU/er7cJy1HJ759Sh+WcVB0oOSc+NcUpQcj54qZsWqtSWFzvLNfLhAV49w+pP8jULSgqrpcJl0nOzrhKdlSnlcTjrqipSj5kmqWlKBSlXVtdoW+bhati6dsUZTjzyh3jhB4GUeK1HwAoMkdj/AGqe3C3DZuE+Oo2G1KD0pR6OL6oQPmRz+VekjSEttJbQkJSkAJA8BVl7Mbe2vbXQ0TTlsAWUDjkPEYLrh6qNXsSAKBUdqO92rT9ofut4nMQobCCtx11YAAH86s7dXdvSm37KWJ0hU27ve7FtkUcb7yj0GB05461jqDtrrbdu+xdQ7uFNssUd0PQdNsOZ4h4F9Q5Z6cuvnigp5StU9oa5ezxFSbDtmyv95I+GRdSDzCPwo9az7pix2vTdhh2Oyw24cCG2G2WUDkkD+Z9aq7fEjQIbUKGw3HjsoCGmm04ShIGAAPAV2POtstlx1YQkdSaDlxaW0KWs4SkZJqAK3bvI41ApioPup/F6muZL7t1f7pvKYiTzP4/+lSTDaWmwhIAAoOUJCEBI5AV9UpQKUpQKUpQKUpQKUoemaBXBI8xVA69JkyDHhgZT8Sj0FfSbTLUn95PIV/ZTyoK3iHmK6ZUduQ2UqANdH2RJSCU3BZV4ZTyrpeNzgAFbXtCPxN9fyoOIr71qe4H1Kciq6Hrwf9KnWHm3mkutKCkKGQRVvP3B1xvhMB88unBX1pyDcWpi5LiyzGUOTJ8/P0oLgWlK0lKgCkjBBGQRWuu+3Za0prJuRd9KBNhvpBVwIA9mfV/aT90nzH5VsZSg8pN0totc7cSVI1HZ3URc4TNZHGwrnge8Oh9Dg1YZGK9jLtbYF2tz1vucNibEfTwusPoC0LHkQeVa5bmdkHQ9+D0rSsp/T0xZ4kt5LkfPlwnmB8jQef8ASsw7gdm/dTR63nHLAu7QmwVe1W496nhHiU/EPkRWJZUSRGdLUlh1hY6pcQUkfQ0HRSuSK4oFKUoFKVzig4rkDNT+ktF6p1ZMEXTtinXFwnH7lslI+augrYvbvsuQbU01ed29SwLPFT75gokJCyOuFL6D6UGDto9rdVblXxECwwXDHCsPzFpIaZHmT5+leiexG0GntqdOiHbx7TcngDMmrHvOq8h5JHgKsaDvPs7oO2N6Y28hPXh1KghuJaIylhazyGV4wST41Xqnb/64eSiFarft/anE57+U4JEz5cCeST88UGT9c680poiAqZqa9RYCAMpQtY41/wB1PU1iWZuBuduihLG1dk+w7I6opXf7qjhKk+Jab6n0NTuldgNKRb4dRaulTNZXsnIk3VQWhHj7rfT86zAy02yyhlptLbaAEpQkYCQPADwoMa7X7Nad0dMXe5zz2odTPkqfu08BTmT1CB0QPl+dZMAA+Vc4qhvkt+Fb1vxo6n3B0Snw9aDvmSmYrXePKAHgPE/KoRRkXV1K5Ce6YSchvPX51RR3m3x7XOd43Rz4Vcgn5CpKLDlTWg6Xiw2oe4kDnigrWg00ngSQK7OJJ6EGqRNkHAeOW8pz8VfH2TMaR+5nFavJY5UFfSo6LLcQ+YstPA6OnkflUjQKUpQKUpQKUpQK+HzwsqPpX2aj7pObaZUgZUsjkkczQd2mk5iOPk5Ljh8PCq2fMiwIb0ybIbjxmUFbrriuFKEjqSfKqbTbLrNqbDyeFSiVY8s1bG++nHNVbT6hsrVyVblPQ1K78HAHCOLCv7Jxg/OguqyXW23u2NXK0T486G8MtvsOBaFfUVXVpD+z515c4+qZ23Uh5LtucbclxgVH924kjiCfQjn9K3dUcJPyoOa4PKteOzVvZe9d7m6u0lqERwqE+6u3lpAThtDpQUnnz8DmtiCQPGgjFXy0i+/Yirgwi48AcEZa+FaknxSD8Q5eFSY6Vo7+0B1XIj7paahWeWqPPtMUvpfjuYdacWrlzHT4R+dbe7WP3aTtzp+RfXC5c3Le0uSs9VLKQST60Fy0wKj9QtLes8hLa3EqCeIFBweVQtqFxbhoXHlqcGOaV86C6sDGMDFWtq7bzROq8DUOmLXPIBAW6wOIZ8lDnVcm8SGfdlw1H+03z/Sq1i7QHeEd+lCj91XI0Gv+pex5tfcu9ctcm82d1xfEO6fDiEDyCVg8vrWOb92I5geUqxa3ZW1k8KJkQhQH95JwfyFbooeaWMocQoehr7oNAZvYx3Hab4o92schWfhDq08vqmoJXZJ3fBIFvtpx/wDnU869G6UHnVD7Jm7SXk97arWsEjPHOASPy51kPTHZW1zBcaKv6FsE4KnXWnZCkfIHka3SpQa+2XYfWqI5jXDdiXAjkY7myW5uKkj1POpy3dm/btEwTL4bzqV7GD9rXBTqCfE8IwP51mYkAZJArpelR2ge8fbTgZ5qoIrTmk9MadYSzYrDbrehIwO4jpSfzxmpvAqNevMBCQUOl0noEJJqlVc58g8MWKGk/ic6/lQTalJSCVEJHma5BBAIOQfGrRvcaQ7DUqZJWvPRIOADVx2dkx7ZGZznhbAzQVdDVgdoCReYG096u9gujlsuVta9rZeR0JRzKSPEEZGDVi9lXfmPuha12m+mPE1LFT76EnCZSPxoHn5igzTcbPCnKSt5vCkkHKTjOPA1XpSlKQlIwAMAVzTIoIC46y0rb9Rs6dnagt0a7vBJahuvhLqgrphJ65xU/WiH7QXVVinbh2e1WdpKb1Z2iqZOaICsq4S23xDnlOCfTirN3Yo3G1RrnQb8TU0eU87a1JbauboP9bSc8iT1UnHM0Gb9QMd5BU8kDvGveSaQXe+jIX5gVXSmg/HcZUcBaSKgI8W521rhUlL7SOhT1x8qCYpXREktyWwpB/6V30ClKUClKUFJc5BjxFLHUdK7bTAQy0l50Bx5Y4lKPPHpVDfcKDLah7qnEgj61PJASkAdAMCg56cqtvdGSxF251E9IebZbTbX8rcUEgZQR1NYo7S+/k/a2Um12vSM2dJW2F+3SElMRPEOQBHNSh5cq0e3F3V3A16pf9JdQTJERS+IREKKGEn0QOX50F/dirVWlNIbtSbpqq6t21tcJxmO66nKOIkE5P3eQrc7drc29aPsyLzYdETtVWxyOHUy4L6ShIIzlSRlWMc8gVrB2J9ltK68tlw1XqthU9qFMTHYicRDaiAFErx1HMcq3gzbLJaUpzGt8CI2EpyQ220gdB5ADFB5bbfa81Npjd5OrdNxEG7yZjvDCWhSkOF5RBaIBBPNWPPIrZDefWPaHs23f9LdQ6hs2kEPuIbYtURsCSsnrhR4jnxIzyq2O0VfNFM79WLWG2cUahvMaUh64x4rRXGddbI4QCkc1HHPHkKipkbfHfDX7et4+lGnWbJJS2xClKS3GaUk8Rb4XCCo56/Sgubs79nefuEp7XO7K7g9HnI44zTj6g9I4hydUrOQPIVtVtvt7B0GZjVqvN7lQZCUBqHOll5uMEjH7skZGfnWrr2oe17qC5TbVCs7trQHFs8TUZtppop8EOK8PIg1dGkNY9p/RdxhQ9Y6KXqa3vLS2XGFIU6gZxkrbJGfH3hQbWqAUkgjIIwagYaTEuT0TB4M8aPkanW1FTaVKTwkjJHlUJLJ/pJ/+iKCRUhKuqQap3YMZz4mxVT4UoIxdnjkEIKkD0URXH2fKQoKamvJKegKsipSuc0EUpm7+E9f+EV9d9ekgALZOPEo61JUoI3vr0oEFbIz4hHSvlLF1UClycsg9cACpSlBFC1uqRwOy3lpPUFVdrdpig5UniPqc1IUoOhuIw3jhbT+VdwCU9BgVzXy58B+VBGts/aF0KV/wWOagfE+FT2QOXSojThJcmj/AL0fyrr13d5Vh0jdL3Ch+2vQI6pAjjOXQgZUkY8SAcetBgfttbgTIemY+3OlQ7Lv17VwyWYyCtxuP5EDoVHl8gax92dey7rS1ansustSXVNiMKQiSmGweJ9YBzwKPRIPQjn1rarby+6V1jZ29V6c9meE0BTzqUjvUrAHuL8QodMVdYGOlBx068qxVv3udL0lbjYtKWiXfNWTm+CNFjNKWI/GCEuuEDAAPTPWpjtARr67tTepWmr3Is1zgsKlsyGVYJ4ASUn0IzVk9mDeq27g6IWq9uxYN7taUMzC48AZACeTvPHXxHnQY62j7KLsu6p1XuxclT5j6+/Xbm1EhSzz/eL6n5Ctq7NardZre1b7XCjwojIw2yygIQkegFYo3f3N1/ZsQ9v9s7vfFlJzOeb4GB5cKQeJX1AFaibjdoXfL7Yftlzub+nZDKxxxWI4ZW2cdDnJx40Ho8FoJICgSORwelc5BFaEbS6G7TSbzG1xZJD6TduF552dcEFD6D0LiCScY6csit84nf8AszftPAHuAd5wHKeLHPHpmghnE+yXxSEpIbdTxDyz41J1HXwlF3hKIPBwkZ8M1IDmKDmlKUClKUEVqFRbjpdSBxIWCM+POp5pRU2lR6lINQd0T302Kwo4CnBmp4UFJdLdb7lGMa5Qo8tg9W32wtJ+hrR7t86h05Futs0Dp6z2yKuKfbJzsdhKFBZBCG8gcuRyfpW3G82v7TttoSdqS5rSpbTZTFjgjifdPJKQPn19M15b6mut61Teblqa6F+U/If7yQ/glKVKJwCfDyHyoNyOwbeVSds39NWSI6mUm4reus1acIZbUAEhB+8shPIdBzJrONy2j01dpjarzOvt1tzIHd2uXcVrihWc8RT1Uf7xI9KtXsSW6PC7PFiebioZdlLfeeUE4U4e9UAonx90AfKo/tN7pah2w1xoWc0U/wBGZbzzdySAOJw+6MemASofKgvHV+ptE7ZIZt1v0y5IuLjfeR7bZ7dxurCfE8IwBgdTWqu33aE3A/0w36NpTS0aaNRTuNqzyCUFl0AJ4uLlhRCfeB5Vuxf757Fpc3y3WmbeytgOMMQkBTjoUnIxkgAEV5m6VVribvY/P0NapTOoU3B59qMhsFTBKzkKB5ADODmg3du+5e72mdFytV6q24s8aFbk97NbYuhU6W8gEoGCBjOTk1d2ye7ml917TIm2FTzMiIUplRXxhbXEDg+oODzFYg7S+pNY2HsoJt2vHIH9KLw+iK8Ip93gC+M/XhSAccudWn+zh01cBM1Lq5xJTAW0iCyeL43ArjVy9Bw8/Wit0KgVKS/f3Vo6NpCD86njyBNW/ZMOOSHuHHG4TRErSlKBSlKBSlKBSlKBSlKBXy58CvlX1Xy58CvlQUem/wCLN/4o/lUwtKSkhQBGOefKofTf8Wb/AMUfyqXc/hq+RoNKezfr/wCxu1TqbStvcxp693CSlqOhPuIeQSUrSB0zgg+lbsV539lyzSLv2tlvNHCIEyZLdOPuhSk4+pUK36iXyNJ1RNsLXN+FHaeeIPTvCrhHzwnP1oKHdFh2TtvqOOwhTjrlskJQlPVR7s4Arz57Fdnt947Qdpi3RtTiGG3pCGj8KnG0Ep4vQHn8wK9Gr9cbXbLa9IvE2NDiBB7xb7gQnhxz5mvNvTmqY+1naNud70VDRqSDFlyWISUKJS8hwEDBTnOM8vPFFj0g1Pe7bpvT8y93eQiNChsl11aj0AHT5157af0lqXtLb2Xy/McES3KkpckvLPJhjPChCR4q4R+dXRuLP7RO+cVFtOjZlusyVBz2ZtssNryeRWpZBVj/APoqm0l2VN7Y0lxpq6wLCy8jDrrVyV72OYBDYyedBvJp6NZtP2u36ahSmkphMIYZZW8C5wpGByzk9KmU9TzrROd2RN2Yr32pC1hapVwbOULEp5DmfRZTyNbQdnez7m2TR64W5t1iz5qFhMbuld4tDYGPfXy4jRF9akaCreXeElTSgpOK+obneR0K9K7ruQLbIJIHuHnVHZwfYW8/hFBWUpSgUpSgjJv+2YX/ABKnTzqDu6VtqZlN8y0sH6VMsOoebS42oFKhmg1B7Q2yG4e4e/yGo8yavSspLb/tDrhLMIYCXEpSTji5ZA8c1ee/23+nNvuybfLFYISENsoZLj6kDvXl96nK1nHM862ONan9vG868sOm3baw2xK0hfOBt51TeXIryTxcAOfhVjIz5Ggy72S//l10f/4JX/8AIupHf/bWFult9J0++UNTG1d/BkKH8J0DkT6EEg1BdjaQ7I7OWllOgAobebTyx7qXlgfpV66k3C0jprUEax6gvDNrlyWu9jmUCht0ZwQlZ90kHqM+IoMf6M3Bd292otUPdiLNttziL+zAWoqnESuEYbU2UAg5QB08QawJtDad2rXuVqfV22e3/d2y8uqbjP3xtTQabLhVkBSgo+vXwrb+JqnRN/ucWDEvNnuc0EuMNNuodUCkc1ADOMedXMOpoPPzeDT2+O4+8Ns0FrBDT8xod4wuIyERW2FY43QcDIT0JPPlit29rdF2vQGibfpi1NoS1FR+8WlOO9cPxLPqTVHu5f8AUGk9OL1LYNPMX0wvfmRu87t72cc1qbVg5IAzg1GbMbyaN3Sgg2OYWbk23xyLc9yda8/RQ9RQZHczwKx1wcVAaeOWVg/EFnI+tXBUBF4Wr1KZTkDiCvqaCUpSlApSlApSlApSlApSlArhXwmua4V0oKLTxSmTNaJ9/jCselTCwSgjxxUJaClu+SUHkpaAR64NTlBpp2MLQbZvJuffLl/Vhaw6y6lfLhC3lLJP0brJfZ8l6k19D1lrqFfmrVGvl3KIYRFS84y2zhHVfLBSOhBwc1rD2jLpqbbrfDXNtsVwl2+NfwFSAk83mlgK5Hw55GfLIrdvs46dc0tslpe0PA9+mEl57KeEhbnvkH1HFj6UFtvdnnSt4uP2hrW/al1ZI7wr4J88oZwfu923wgD5VkPS2hdH6XhtRLBpu2wGmjlAbYTxZ8+I8yfXNYt7Rm5usdpdSWrUUe0m86QkslicwAEGO8FclBfPmoHoRj3a6dmu0SndfXMbT+ntJzIcRuOuRcZcp1Ku5wPdSkJ65OBk/lQZ8AAGKi9S3VFisUu7uRJUpuK2XHG4yONwpHxEDxwMnHpUoOgqF1jMu1v07Ll2ayi9S20EphGQGS6PEBRBGceHjQUe3+u9Ka8tqrhpa9Rri0jAdShWHGiegWk80nkevlVzDHhXlpZ9c6s2y3bmahgW16wyVylLftboUEKbUonu1A9R5HHrXpxpO7NX/TNsvjCChq4RGpSEnqAtAVj9aDjUzgFvDPIl1YSBXZERwR0p9KptSjLsL/iH+VVqPhFBzSlKBSlKD5cQlaClQyKiJ0eTAzJhOqTg5UjPJQqZr4fQHGlII6igqYroejNujHvpB5VZe/GihuBtbedMIQ2qS+1xxSs4CXk80nPhz5fWp60yRBcMGQeFGctqPT5VMBSFH3VA/I0Fm7HaVm6K2n09pe4rbXMgRQh8t/DxklRA88ZxmortB7TWndnR32XLX7NcYhU7b5Yz+6WRzBHik4GayQpSU9VAfM07xH40/nQYI7LOwn+ilMy7XmaxPvktPdcTST3bDec4STzJPLNZ5AxXxxtj76fzqmfukBh0NOyUJWfCgjdfadc1VpabY27xOtIltKaXIiFPHwqBBHvA8jn0rWDbXsuay0Du5a9RW7U8R+0w5AW6Ulbbrjfikp5g/nW3SHW14KVpOemDX3igVBOLSvULoQMFCAFcutTEiSywgrdcSkDrzqHtwL8t6YU8IcPu58hQSVKUoFKUoFKUoFKUoFKUoFKUoIx8+z3uO+DhK8oV9ans1FXCMJDRHQjmD618Qrr3Ke5n5QtJwFgciKCxN69jNHbpPxJ91bch3SMpOJkcAKcbByW1joofqKybDjNRIjMVkcLbLaW0DyAGBVN9s23P+sp/I0+2bb/+KR+tBRa70vatZaTuGmryyHYc5ktr80nwUPUHBrGPZq2MTtDIvbzl2bubtwKEtuJaKChtJOAfXnWZG5cZw8KH21HGcBVfanWkglTiAB45oPsdKVF3C7NNIKImH3yPdA6D510Q7w+hGLjGKFfibGQaC192Nm9CbmGO9qa18UuPyblR1lt0JzzSSPiHoc4zyq+7bDj263x4ERpLUeO0lpptPRKUgAAfICqZu9W9aOIvFHopJBr5dvcMEpb7x1WOXCnkfrQdWocKkQkA+8Fk49MVWJ+EVHMh6bNEt9vuwkYQnPQVJeFApSlApSlApSlB0yY7T6cOJBqhNpbSvjadcbUeWUqIpSgG0oWQXnnXCOQyo0+xo3mr/EaUoAs8YHOVf4jXcm2RQMFsHPiedKUHSu0s8YUha0KHQpUa4+zXM/66/wD4zSlB2NWtoL7xxSnFeajmq9CQgBKQAKUoPqlKUClKUClKUClKUClKUClKUCvhbLa/jSDSlB1exx/+zFcKhRiMFsflSlB0LtMQniCACfEV8ptEYE54iD1GTSlBVx4jLA9xAFdqkIUOaQaUoOpUVg8y2Pyr6bYaR8KAKUoO2lKUClKUH//Z";

// Safe localStorage helpers — work in deployed PWA, fail silently in sandboxed preview
const lsGet = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const lsSet = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const RANKS = [
  { min:0,  kanji:"新", title:"Newcomer",      sub:"Kouhai",         color:MUTED  },
  { min:5,  kanji:"戦", title:"Warrior",       sub:"Senshi",         color:BLACK  },
  { min:15, kanji:"幹", title:"Executive",     sub:"Kanbu",          color:"#8B4513" },
  { min:30, kanji:"副", title:"Commander",     sub:"Fuku Souchou",   color:RED    },
  { min:50, kanji:"天", title:"King of Kings", sub:"Tenjiku Supreme",color:RED    },
];
const getRank = (s) => [...RANKS].reverse().find(r => s >= r.min) || RANKS[0];

const DIET_OPTIONS = ["None","Carnivore","Keto","Paleo","Mediterranean","Vegan","Vegetarian","Pescatarian","Gluten-Free","Dairy-Free","Custom"];

const DIET_MACROS = {
  "None":          { protein:0.30, carbs:0.40, fat:0.30 },
  "Carnivore":     { protein:0.40, carbs:0.00, fat:0.60 },
  "Keto":          { protein:0.25, carbs:0.05, fat:0.70 },
  "Paleo":         { protein:0.30, carbs:0.35, fat:0.35 },
  "Mediterranean": { protein:0.20, carbs:0.45, fat:0.35 },
  "Vegan":         { protein:0.20, carbs:0.55, fat:0.25 },
  "Vegetarian":    { protein:0.20, carbs:0.50, fat:0.30 },
  "Pescatarian":   { protein:0.25, carbs:0.45, fat:0.30 },
  "Gluten-Free":   { protein:0.25, carbs:0.45, fat:0.30 },
  "Dairy-Free":    { protein:0.25, carbs:0.45, fat:0.30 },
};

const ACTIVITY_LEVELS = {
  sedentary:  { label:"Sedentary — desk job, no exercise",      mult:1.2   },
  light:      { label:"Light — 1-3 workouts/week",              mult:1.375 },
  moderate:   { label:"Moderate — 3-5 workouts/week",           mult:1.55  },
  active:     { label:"Active — 6-7 workouts/week",             mult:1.725 },
  veryActive: { label:"Very Active — athlete / physical job",   mult:1.9   },
};

const DIET_TYPES = ["None","High Protein","Keto","Paleo","Mediterranean","Vegetarian","Vegan","Gluten-Free","Dairy-Free"];

const calcTDEE = ({ age, weightLbs, heightIn, sex, activity, goal }) => {
  const kg = parseFloat(weightLbs) * 0.453592;
  const cm = parseFloat(heightIn) * 2.54;
  const a  = parseFloat(age);
  if (!kg||!cm||!a) return null;
  const bmr = sex==="male" ? (10*kg + 6.25*cm - 5*a + 5) : (10*kg + 6.25*cm - 5*a - 161);
  const tdee = Math.round(bmr * (ACTIVITY_LEVELS[activity]?.mult||1.55));
  const adj  = { cut:-500, bulk:300, recomp:0, endure:200 }[goal]||0;
  const calories = Math.max(1200, tdee + adj);
  const protein  = Math.round(parseFloat(weightLbs) * 0.82);
  const fat      = Math.round(calories * 0.25 / 9);
  const carbs    = Math.max(20, Math.round((calories - protein*4 - fat*9) / 4));
  return { calories, protein, carbs, fat };
};

const ANIM = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=Noto+Serif+JP:wght@700&display=swap');
  @keyframes spinIn{0%{transform:rotate(0deg) scale(0);opacity:0}60%{transform:rotate(540deg) scale(1.15);opacity:1}100%{transform:rotate(720deg) scale(1);opacity:1}}
  @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes lineGrow{from{width:0}to{width:100%}}
  @keyframes kanjiDrop{0%{opacity:0;transform:translateY(-30px) scale(1.4)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
  @keyframes scanLine{0%{top:10%}50%{top:85%}100%{top:10%}}
  @keyframes rankPulse{0%{transform:scale(0.5);opacity:0}50%{transform:scale(1.2);opacity:1}100%{transform:scale(1);opacity:1}}
  @keyframes rankShine{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}
  .spin-in{animation:spinIn 1.6s cubic-bezier(.22,1,.36,1) forwards}
  .spin-slow{animation:spinSlow 12s linear infinite}
  .fade-up{animation:fadeUp 0.7s ease forwards}
  .slide-up{animation:slideUp 0.35s cubic-bezier(.22,1,.36,1) forwards}
`;

function YinYang({ size=32, style={}, className="" }) {
  return <img src={TENJIKU_IMG} width={size} height={size} alt="Tenjiku" className={className} style={{ objectFit:"contain", display:"block", ...style }}/>;
}

function Ring({ value, max, size=80, stroke=8, color=RED, label }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r, dash=Math.min(value/max,1)*circ;
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={CARD2} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition:"stroke-dasharray 0.5s ease" }}/>
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily:"'Bebas Neue'", fontSize:18, fill:TEXT }}>{Math.round(value)}</text>
        <text x={size/2} y={size/2+14} textAnchor="middle" dominantBaseline="middle"
          style={{ fontFamily:"'DM Sans'", fontSize:9, fill:MUTED }}>/{max}</text>
      </svg>
      {label && <span style={{ fontFamily:"'DM Sans'", fontSize:11, color:MUTED, textTransform:"uppercase", letterSpacing:1 }}>{label}</span>}
    </div>
  );
}

function MacroBar({ label, val, max, color }) {
  const pct=Math.min(val/max,1)*100;
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontFamily:"'DM Sans'", fontSize:12, color:MUTED }}>{label}</span>
        <span style={{ fontFamily:"'DM Sans'", fontSize:12, color:TEXT }}>{Math.round(val)}g / {max}g</span>
      </div>
      <div style={{ height:5, background:CARD2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:color, transition:"width 0.5s ease" }}/>
      </div>
    </div>
  );
}

function WeightChart({ data }) {
  if (!data||data.length<2) return <div style={{ textAlign:"center", padding:"20px 0", color:MUTED, fontSize:13 }}>Log at least 2 entries to see your trend</div>;
  const weights=data.map(d=>parseFloat(d.weight));
  const minW=Math.min(...weights)-2, maxW=Math.max(...weights)+2;
  const W=320, H=100, pad=20;
  const toX=(i)=>pad+(i/(data.length-1))*(W-pad*2);
  const toY=(w)=>H-pad-((w-minW)/(maxW-minW))*(H-pad*2);
  const pts=data.map((d,i)=>`${toX(i)},${toY(parseFloat(d.weight))}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={RED} strokeWidth="2.5" strokeLinejoin="round"/>
      {data.map((d,i)=>(
        <g key={i}>
          <circle cx={toX(i)} cy={toY(parseFloat(d.weight))} r="4" fill={RED}/>
          <text x={toX(i)} y={toY(parseFloat(d.weight))-8} textAnchor="middle" style={{ fontSize:9, fontFamily:"'DM Sans'", fill:TEXT }}>{d.weight}</text>
        </g>
      ))}
    </svg>
  );
}

function SleepChart({ data }) {
  if (!data||data.length<2) return <div style={{ textAlign:"center", padding:"20px 0", color:MUTED, fontSize:13 }}>Log at least 2 entries to see your trend</div>;
  const hours=data.map(d=>parseFloat(d.hours));
  const minH=Math.max(0,Math.min(...hours)-1), maxH=Math.max(...hours)+1;
  const W=320, H=100, pad=20;
  const toX=(i)=>pad+(i/(data.length-1))*(W-pad*2);
  const toY=(h)=>H-pad-((h-minH)/(maxH-minH))*(H-pad*2);
  const pts=data.map((d,i)=>`${toX(i)},${toY(parseFloat(d.hours))}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      {/* 8hr reference line */}
      {maxH>=8&&minH<=8&&<line x1={pad} x2={W-pad} y1={toY(8)} y2={toY(8)} stroke={MUTED} strokeWidth="1" strokeDasharray="4,4"/>}
      <polyline points={pts} fill="none" stroke={BLACK} strokeWidth="2.5" strokeLinejoin="round"/>
      {data.map((d,i)=>(
        <g key={i}>
          <circle cx={toX(i)} cy={toY(parseFloat(d.hours))} r="4" fill={parseFloat(d.hours)>=7?BLACK:RED}/>
          <text x={toX(i)} y={toY(parseFloat(d.hours))-8} textAnchor="middle" style={{ fontSize:9, fontFamily:"'DM Sans'", fill:TEXT }}>{d.hours}h</text>
        </g>
      ))}
    </svg>
  );
}

function CardioChart({ data }) {
  if (!data||data.length<2) return <div style={{ textAlign:"center", padding:"20px 0", color:MUTED, fontSize:13 }}>Log at least 2 sessions to see your trend</div>;
  const durations = data.map(d=>parseFloat(d.duration)||0);
  const maxD = Math.max(...durations)+5;
  const W=320, H=100, pad=20;
  const toX=(i)=>pad+(i/(data.length-1))*(W-pad*2);
  const toY=(v)=>H-pad-(v/maxD)*(H-pad*2);
  const pts=data.map((d,i)=>`${toX(i)},${toY(parseFloat(d.duration)||0)}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={RED} strokeWidth="2.5" strokeLinejoin="round"/>
      {data.map((d,i)=>(
        <g key={i}>
          <circle cx={toX(i)} cy={toY(parseFloat(d.duration)||0)} r="4" fill={RED}/>
          <text x={toX(i)} y={toY(parseFloat(d.duration)||0)-8} textAnchor="middle" style={{ fontSize:9, fontFamily:"'DM Sans'", fill:TEXT }}>{d.duration}m</text>
        </g>
      ))}
    </svg>
  );
}

function VolumeChart({ sessions, exercise }) {
  // Gather volume (sets × reps × weight) per session for a given exercise
  const data = sessions.map(s => {
    const ex = s.exercises?.find(e=>e.name===exercise);
    if (!ex) return null;
    const vol = ex.sets?.reduce((sum,st)=>{
      const r = parseFloat(st.reps)||0;
      const w = parseFloat(st.weight)||0;
      return sum + (r * w);
    }, 0) || 0;
    return { date: s.date||s.start, vol };
  }).filter(Boolean).filter(d=>d.vol>0).slice(-10);

  if (data.length < 2) return <div style={{ textAlign:"center", padding:"12px 0", color:MUTED, fontSize:12 }}>Log at least 2 sessions with weight to see volume trend</div>;

  const maxV = Math.max(...data.map(d=>d.vol));
  const W=320, H=80, pad=20;
  const toX=(i)=>pad+(i/(data.length-1))*(W-pad*2);
  const toY=(v)=>H-pad-(v/maxV)*(H-pad*2);
  const pts=data.map((d,i)=>`${toX(i)},${toY(d.vol)}`).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
      <polyline points={pts} fill="none" stroke={RED} strokeWidth="2" strokeLinejoin="round"/>
      {data.map((d,i)=>(
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.vol)} r="3.5" fill={RED}/>
          <text x={toX(i)} y={toY(d.vol)-7} textAnchor="middle" style={{ fontSize:8, fontFamily:"'DM Sans'", fill:TEXT }}>{Math.round(d.vol/1000*10)/10}k</text>
        </g>
      ))}
    </svg>
  );
}

function StarRating({ value, onChange, color=RED }) {
  return (
    <div style={{ display:"flex", gap:6 }}>
      {[1,2,3,4,5].map(s=>(
        <div key={s} onClick={()=>onChange(s)} style={{ width:28, height:28, cursor:"pointer",
          background:s<=value?color:CARD2, border:`1px solid ${s<=value?color:BORDER}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Bebas Neue'", fontSize:14, color:s<=value?WHITE:MUTED }}>{s}</div>
      ))}
    </div>
  );
}

/* ── BARCODE SCANNER ─────────────────────────────── */
function BarcodeScanner({ onDetected }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("init");
  const [msg, setMsg] = useState("Starting camera...");

  useEffect(() => {
    let stream = null, rafId = null, active = true;
    let zxingReader = null;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal:"environment" }, width:{ ideal:1280 }, height:{ ideal:720 } }
        });
        if (!active || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("scanning");
        setMsg("Point at barcode or QR code");

        // Try native BarcodeDetector first (Android Chrome, desktop)
        if ("BarcodeDetector" in window) {
          const detector = new window.BarcodeDetector({ formats:["ean_13","ean_8","upc_a","upc_e","code_128","code_39","qr_code"] });
          const tick = async () => {
            if (!active || !videoRef.current) return;
            try {
              const codes = await detector.detect(videoRef.current);
              if (codes.length > 0) { active=false; onDetected(codes[0].rawValue); return; }
            } catch {}
            rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
          return;
        }

        // Fallback: zxing-js for iOS Safari and other browsers
        try {
          const { BrowserMultiFormatReader } = await import("@zxing/browser");
          zxingReader = new BrowserMultiFormatReader();
          zxingReader.decodeFromVideoElement(videoRef.current, (result, err) => {
            if (!active) return;
            if (result) { active=false; onDetected(result.getText()); }
          });
        } catch (zxingErr) {
          // zxing not available — canvas frame fallback
          setMsg("Scanning... (manual detection mode)");
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const tick = () => {
            if (!active || !videoRef.current) return;
            try {
              canvas.width  = videoRef.current.videoWidth;
              canvas.height = videoRef.current.videoHeight;
              ctx.drawImage(videoRef.current, 0, 0);
            } catch {}
            rafId = requestAnimationFrame(tick);
          };
          rafId = requestAnimationFrame(tick);
        }
      } catch {
        setStatus("error");
        setMsg("Camera access denied. Please allow camera permissions.");
      }
    })();

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      stream?.getTracks().forEach(t => t.stop());
      try { zxingReader?.reset(); } catch {}
    };
  }, []);

  return (
    <div>
      <div style={{ position:"relative", background:BLACK, marginBottom:10 }}>
        <video ref={videoRef} playsInline muted style={{ width:"100%", height:230, objectFit:"cover", display:"block" }}/>
        {status==="scanning" && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ width:220, height:120, border:`2px solid ${RED}`, boxShadow:"0 0 0 1000px rgba(0,0,0,0.55)", position:"relative" }}>
              <div style={{ position:"absolute", left:0, right:0, height:2, background:RED+"88", animation:"scanLine 2s ease-in-out infinite" }}/>
            </div>
          </div>
        )}
      </div>
      <div style={{ textAlign:"center", fontSize:12, color:status==="error"?RED:MUTED, padding:"0 0 10px" }}>{msg}</div>
    </div>
  );
}

/* ── WEBCAM CAPTURE (desktop) ────────────────────── */
function WebcamCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let stream = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:"user", width:{ ideal:1280 }, height:{ ideal:720 } } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch { setError("Camera access denied. Please allow camera permissions in your browser."); }
    })();
    return () => stream?.getTracks().forEach(t=>t.stop());
  }, []);

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    const base64 = c.toDataURL("image/jpeg", 0.85).split(",")[1];
    onCapture(base64);
  };

  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ position:"relative", background:BLACK, marginBottom:10 }}>
        {error
          ? <div style={{ padding:"40px 20px", textAlign:"center", color:RED, fontSize:12 }}>{error}</div>
          : <video ref={videoRef} playsInline muted style={{ width:"100%", maxHeight:280, objectFit:"cover", display:"block" }}/>
        }
        <button onClick={onClose} style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.7)", border:"none", color:WHITE, width:28, height:28, cursor:"pointer", fontSize:14 }}>✕</button>
      </div>
      <canvas ref={canvasRef} style={{ display:"none" }}/>
      {!error && <button style={{ background:RED, color:WHITE, border:"none", width:"100%", padding:"12px", fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:2, cursor:ready?"pointer":"not-allowed", opacity:ready?1:0.6 }}
        onClick={capture} disabled={!ready}>
        📸 CAPTURE
      </button>}
    </div>
  );
}

/* ── RESULT CARD WITH QUANTITY ───────────────────── */
function ResultCard({ result, quantity, onQuantityChange, onAdd, onBack, backLabel, extraBtn }) {
  const q = quantity;
  const scaled = {
    calories: Math.round(result.calories * q),
    protein:  Math.round(result.protein  * q * 10) / 10,
    carbs:    Math.round(result.carbs    * q * 10) / 10,
    fat:      Math.round(result.fat      * q * 10) / 10,
  };
  const qLabel = q % 1 === 0 ? String(q) : q.toFixed(1);
  const dec = () => onQuantityChange(Math.max(0.5, parseFloat((q - 0.5).toFixed(1))));
  const inc = () => onQuantityChange(parseFloat((q + 0.5).toFixed(1)));

  const addEntry = {
    ...result,
    ...scaled,
    serving: q !== 1 ? `${qLabel} × ${result.serving}` : result.serving,
  };

  return (
    <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${RED}`, padding:"14px", marginBottom:14 }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <div style={{ flex:1, paddingRight:8 }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:1, lineHeight:1.1 }}>{result.name}</div>
          <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>{result.serving} · per serving</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
          <span style={{ background:( result.confidence==="high"?BLACK:RED)+"18", color:result.confidence==="high"?BLACK:RED, border:`1px solid ${result.confidence==="high"?BLACK:RED}44`, borderRadius:2, padding:"2px 7px", fontSize:10, fontWeight:600 }}>{result.confidence}</span>
          {onBack && <button onClick={onBack} style={{ fontSize:10, color:RED, background:"transparent", border:"none", cursor:"pointer", padding:0, letterSpacing:0.3 }}>{backLabel||"← Back"}</button>}
        </div>
      </div>

      {/* Quantity selector */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:CARD2, padding:"10px 14px", marginBottom:12, borderLeft:`2px solid ${RED}` }}>
        <div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2 }}>QUANTITY</div>
          {q !== 1 && <div style={{ fontSize:10, color:MUTED, marginTop:1 }}>{result.calories} kcal × {qLabel}</div>}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <button onClick={dec} style={{ width:34, height:34, background:q<=0.5?CARD2:RED, color:q<=0.5?MUTED:WHITE, border:`1px solid ${q<=0.5?BORDER:RED}`, fontSize:20, fontWeight:700, cursor:q<=0.5?"default":"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>−</button>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:TEXT, minWidth:36, textAlign:"center", lineHeight:1 }}>{qLabel}</div>
          <button onClick={inc} style={{ width:34, height:34, background:RED, color:WHITE, border:`1px solid ${RED}`, fontSize:20, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>+</button>
        </div>
      </div>

      {/* Live macros */}
      <div style={{ display:"flex", gap:6, marginBottom:10 }}>
        <div style={{ background:RED+"12", color:RED, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${RED}` }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20 }}>{scaled.calories}</div><div style={{ fontSize:9, color:MUTED }}>KCAL</div>
        </div>
        <div style={{ background:BLACK+"12", color:BLACK, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${BLACK}` }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:BLACK }}>{scaled.protein}g</div><div style={{ fontSize:9, color:MUTED }}>PROT</div>
        </div>
        <div style={{ background:MUTED+"12", color:MUTED, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${MUTED}` }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20 }}>{scaled.carbs}g</div><div style={{ fontSize:9, color:MUTED }}>CARB</div>
        </div>
        <div style={{ background:RED_DIM+"12", color:RED_DIM, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${RED_DIM}` }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20 }}>{scaled.fat}g</div><div style={{ fontSize:9, color:MUTED }}>FAT</div>
        </div>
      </div>

      {result.notes && <div style={{ fontSize:11, color:MUTED, marginBottom:10, fontStyle:"italic" }}>ℹ️ {result.notes}</div>}

      <div style={{ display:"flex", gap:8 }}>
        <button style={{ flex:1, background:RED, color:WHITE, border:"none", borderRadius:0, padding:"13px 16px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", letterSpacing:1, textTransform:"uppercase" }}
          onClick={()=>onAdd(addEntry)}>
          + Add {q !== 1 ? `${qLabel} × ` : ""}to Log
        </button>
        {extraBtn}
      </div>
    </div>
  );
}

/* ── ADD FOOD PANEL ──────────────────────────────── */
function AddFoodPanel({ onAdd, onClose, favorites, recentFoods }) {
  const [mode, setMode] = useState("search");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [options, setOptions] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [imgBase64, setImgBase64] = useState(null);
  const [barcodeVal, setBarcodeVal] = useState(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [mealType, setMealType] = useState(() => {
    const h = new Date().getHours();
    if (h < 10) return "Breakfast";
    if (h < 13) return "Lunch";
    if (h < 17) return "Snack";
    if (h < 20) return "Dinner";
    return "Snack";
  });
  const fileRef = useRef();
  const cameraRef = useRef();

  const filteredFavs = favorites.filter(f => !query || f.name.toLowerCase().includes(query.toLowerCase()));
  const filteredRecent = recentFoods.filter(f =>
    query && f.name.toLowerCase().includes(query.toLowerCase()) &&
    !favorites.find(fav => fav.name === f.name)
  );

  const lookupByName = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(""); setResult(null); setOptions([]);
    try {
      const res = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1200,
          messages:[{ role:"user", content:`Give 4 to 6 distinct variations of: "${query}". Vary by size, preparation method, fat content, cut of meat, cooking style, or restaurant vs homemade — whatever makes the most sense for this food. Each option should be meaningfully different so the user can pick the right one. Respond ONLY with valid JSON (no markdown): {"options":[{"name":"specific descriptive name","calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"serving":"serving size description","confidence":"high/medium/low","notes":"1 sentence on what makes this variation distinct"}]}` }]
        })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());
      if (parsed.options && parsed.options.length > 0) {
        setOptions(parsed.options);
      } else {
        selectResult(parsed);
      }
    } catch { setError("Couldn't look up that food. Try a different name."); }
    setLoading(false);
  };

  const lookupBarcode = async (code) => {
    setBarcodeVal(code); setLoading(true); setError(""); setResult(null);
    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Lookup timed out. Check your connection and try again.");
    }, 20000);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      if (data.status===1 && data.product) {
        const p = data.product, n = p.nutriments||{};
        const sg = parseFloat(p.serving_quantity)||100, f = sg/100;
        clearTimeout(timeout);
        selectResult({
          name: p.product_name||p.product_name_en||"Unknown Product",
          calories: Math.round((n["energy-kcal_100g"]||0)*f),
          protein: Math.round((n.proteins_100g||0)*f*10)/10,
          carbs: Math.round((n.carbohydrates_100g||0)*f*10)/10,
          fat: Math.round((n.fat_100g||0)*f*10)/10,
          fiber: Math.round((n.fiber_100g||0)*f*10)/10,
          sugar: Math.round((n.sugars_100g||0)*f*10)/10,
          serving: p.serving_size||"1 serving",
          confidence:"high", notes:`Barcode: ${code}`
        });
      } else {
        // Fallback to AI search using the barcode as a product lookup
        try {
          const aiRes = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
              messages:[{ role:"user", content:`A product with barcode ${code} was not found in the Open Food Facts database. Based on the barcode number alone, try to estimate what common product this might be, or provide a reasonable generic food entry. Respond ONLY with valid JSON (no markdown): {"name":"product name or best guess","calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"serving":"1 serving","confidence":"low","notes":"Not found in database — AI estimate only"}` }]
            })
          });
          const aiData = await aiRes.json();
          const txt = aiData.content?.find(b=>b.type==="text")?.text||"";
          clearTimeout(timeout);
          selectResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
        } catch {
          clearTimeout(timeout);
          setError("Product not found. Try the Search or Photo tab instead.");
          setLoading(false);
        }
      }
    } catch {
      clearTimeout(timeout);
      setError("Lookup failed. Check your connection.");
      setLoading(false);
    }
  };

  const analyzePhoto = async () => {
    if (!imgBase64) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800,
          messages:[{ role:"user", content:[
            { type:"image", source:{ type:"base64", media_type:"image/jpeg", data:imgBase64 }},
            { type:"text", text:`Analyze this food image. Respond ONLY with valid JSON (no markdown): {"name":"dish name","calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"serving":"description","confidence":"high/medium/low","notes":"brief note"}` }
          ]}]
        })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      selectResult(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch { setError("Couldn't analyze image. Try again."); }
    setLoading(false);
  };

  const handleFile = (file) => {
    if (!file) return;
    setResult(null); setError("");
    const r = new FileReader();
    r.onload = e => { setImgPreview(e.target.result); setImgBase64(e.target.result.split(",")[1]); };
    r.readAsDataURL(file);
  };

  const quickAdd = (food) => {
    onAdd({ ...food, mealType, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), id:Date.now() });
  };

  const selectResult = (r) => { setResult(r); setQuantity(1); };

  const S = {
    overlay: { position:"fixed", inset:0, zIndex:500, display:"flex", flexDirection:"column" },
    backdrop: { flex:1, background:"rgba(0,0,0,0.55)" },
    panel: { background:BG, maxHeight:"88vh", display:"flex", flexDirection:"column", animation:"slideUp 0.35s cubic-bezier(.22,1,.36,1)" },
    panelHead: { background:BLACK, padding:"12px 16px 0", flexShrink:0 },
    body: { overflowY:"auto", padding:"14px 14px 30px", flex:1 },
    modeTab: (a) => ({ flex:1, padding:"10px 4px 8px", fontFamily:"'Bebas Neue'", fontSize:12, letterSpacing:1.5,
      color:a?RED:"#555", background:"transparent", border:"none", borderBottom:`2px solid ${a?RED:"transparent"}`, cursor:"pointer" }),
    card: { background:CARD, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${RED}`, padding:"12px", marginBottom:8 },
    input: { background:"#F5F4F2", color:"#111111", border:`1px solid ${BORDER}`, borderBottom:`2px solid ${RED}`, borderRadius:0, padding:"9px 10px", fontSize:13, fontFamily:"'DM Sans'", width:"100%", boxSizing:"border-box", outline:"none" },
    btn: { background:RED, color:WHITE, border:"none", borderRadius:0, padding:"12px 16px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnSm: { background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"6px 12px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" },
    btnSmRed: { background:"transparent", color:RED, border:`1px solid ${RED}`, borderRadius:0, padding:"6px 12px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" },
    pill: (c) => ({ background:c+"18", color:c, border:`1px solid ${c}44`, borderRadius:2, padding:"2px 7px", fontSize:10, fontWeight:600, display:"inline-block" }),
    macroChip: (c) => ({ background:c+"12", color:c, borderRadius:0, padding:"7px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${c}` }),
    favItem: { background:CARD, border:`1px solid ${BORDER}`, borderRadius:0, padding:"10px 12px", cursor:"pointer", textAlign:"left", width:"100%", marginBottom:6, display:"flex", justifyContent:"space-between", alignItems:"center" },
  };

  return (
    <div style={S.overlay}>
      <div style={S.backdrop} onClick={onClose}/>
      <div style={S.panel}>
        {/* Header */}
        <div style={S.panelHead}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:WHITE, letterSpacing:2 }}>LOG FOOD</div>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", fontSize:20, cursor:"pointer", lineHeight:1 }}>✕</button>
          </div>
          {/* Meal type selector */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:8, marginBottom:4 }}>
            {["Breakfast","Lunch","Dinner","Snack","Pre-Workout","Post-Workout"].map(m=>(
              <button key={m} onClick={()=>setMealType(m)} style={{
                flexShrink:0, padding:"5px 10px", fontFamily:"'Bebas Neue'", fontSize:11, letterSpacing:1.5,
                background:mealType===m?RED:"transparent", color:mealType===m?WHITE:"#555",
                border:`1px solid ${mealType===m?RED:"#333"}`, cursor:"pointer", whiteSpace:"nowrap"
              }}>{m}</button>
            ))}
          </div>
          <div style={{ display:"flex" }}>
            {[{ id:"search", icon:"🔍", label:"Search" },{ id:"photo", icon:"📷", label:"Photo" },{ id:"barcode", icon:"📊", label:"Barcode" }].map(t=>(
              <button key={t.id} style={S.modeTab(mode===t.id)} onClick={()=>{ setMode(t.id); setResult(null); setOptions([]); setError(""); setBarcodeVal(null); setImgPreview(null); }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={S.body}>
          {/* ── SEARCH MODE ── */}
          {mode==="search" && (<>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              <input style={{ ...S.input, flex:1 }} placeholder="Search foods or enter a food name..." value={query}
                onChange={e=>{ setQuery(e.target.value); setResult(null); setOptions([]); setError(""); }}
                onKeyDown={e=>e.key==="Enter"&&lookupByName()}/>
              {query && <button style={S.btnSmRed} onClick={lookupByName}>Look Up</button>}
            </div>

            {loading && (
              <div style={{ textAlign:"center", padding:"16px 0" }}>
                <div style={{ fontSize:13, color:MUTED, marginBottom:6 }}>🤖 Finding options for "{query}"...</div>
                <div style={{ height:2, background:CARD2, overflow:"hidden", borderRadius:2 }}>
                  <div style={{ height:"100%", width:"70%", background:RED, animation:"lineGrow 1s ease forwards" }}/>
                </div>
              </div>
            )}
            {error && <div style={{ fontSize:12, color:RED, marginBottom:12 }}>{error}</div>}

            {/* OPTIONS LIST — shown when Claude returns multiple variations */}
            {options.length > 0 && !result && (
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid ${RED}44`, paddingBottom:5 }}>
                  SELECT A VARIATION — {query.toUpperCase()}
                </div>
                {options.map((opt, i) => (
                  <button key={i} onClick={()=>selectResult(opt)} style={{
                    width:"100%", textAlign:"left", background:CARD, border:`1px solid ${BORDER}`,
                    borderLeft:`3px solid ${RED}`, borderRadius:0, padding:"11px 12px",
                    marginBottom:6, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                  }}>
                    <div style={{ flex:1, paddingRight:10 }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:0.5, color:TEXT, marginBottom:2 }}>{opt.name}</div>
                      <div style={{ fontSize:10, color:MUTED, marginBottom:4 }}>{opt.serving}</div>
                      {opt.notes && <div style={{ fontSize:10, color:MUTED, fontStyle:"italic" }}>{opt.notes}</div>}
                      <div style={{ display:"flex", gap:6, marginTop:5 }}>
                        <span style={{ fontSize:10, color:BLACK, fontWeight:600 }}>P {Math.round(opt.protein)}g</span>
                        <span style={{ fontSize:10, color:MUTED }}>·</span>
                        <span style={{ fontSize:10, color:MUTED }}>C {Math.round(opt.carbs)}g</span>
                        <span style={{ fontSize:10, color:MUTED }}>·</span>
                        <span style={{ fontSize:10, color:MUTED }}>F {Math.round(opt.fat)}g</span>
                      </div>
                    </div>
                    <div style={{ flexShrink:0, textAlign:"right" }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:RED, lineHeight:1 }}>{Math.round(opt.calories)}</div>
                      <div style={{ fontSize:9, color:MUTED }}>KCAL</div>
                    </div>
                  </button>
                ))}
                <button onClick={()=>{ setOptions([]); setQuery(""); }} style={{ fontSize:11, color:MUTED, background:"transparent", border:"none", cursor:"pointer", padding:"4px 0", letterSpacing:0.5 }}>
                  ← Search something else
                </button>
              </div>
            )}

            {/* SELECTED RESULT — shown after picking a variation */}
            {result && (
              <ResultCard
                result={result}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAdd={(entry)=>{ quickAdd(entry); onClose(); }}
                onBack={options.length>0?()=>setResult(null):null}
                backLabel="← Other options"
              />
            )}

            {/* Favorites */}
            {favorites.length > 0 && (<>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:8, borderBottom:`1px solid ${RED}44`, paddingBottom:5 }}>
                ★ FAVORITES
              </div>
              {filteredFavs.map((f,i)=>(
                <button key={i} style={S.favItem} onClick={()=>{ quickAdd(f); onClose(); }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, textAlign:"left" }}>{f.name}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{f.serving}</div>
                  </div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED, flexShrink:0, marginLeft:10 }}>{Math.round(f.calories)} kcal</div>
                </button>
              ))}
              {query && filteredFavs.length===0 && favorites.length>0 && <div style={{ fontSize:12, color:MUTED, marginBottom:10 }}>No favorites match "{query}"</div>}
            </>)}

            {/* Recent matches */}
            {filteredRecent.length > 0 && (<>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:2, marginBottom:8, marginTop:4, borderBottom:`1px solid ${BORDER}`, paddingBottom:5 }}>RECENT MATCHES</div>
              {filteredRecent.slice(0,5).map((f,i)=>(
                <button key={i} style={S.favItem} onClick={()=>{ quickAdd(f); onClose(); }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, textAlign:"left" }}>{f.name}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{f.serving}</div>
                  </div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:MUTED, flexShrink:0, marginLeft:10 }}>{Math.round(f.calories)} kcal</div>
                </button>
              ))}
            </>)}

            {!query && favorites.length===0 && (
              <div style={{ textAlign:"center", padding:"30px 20px", color:MUTED }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🔍</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:1, marginBottom:6 }}>Search Any Food</div>
                <div style={{ fontSize:12, lineHeight:1.6 }}>Type a food name above and tap Look Up. Claude will estimate the nutrition. Star items you eat often for quick access.</div>
              </div>
            )}
          </>)}

          {/* ── PHOTO MODE ── */}
          {mode==="photo" && (<>
            {imgPreview
              ? <div style={{ position:"relative", marginBottom:12 }}>
                  <img src={imgPreview} alt="Food" style={{ width:"100%", maxHeight:220, objectFit:"contain", background:BLACK, display:"block" }}/>
                  <button onClick={()=>{ setImgPreview(null); setImgBase64(null); setResult(null); setShowWebcam(false); }}
                    style={{ position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.7)", border:`1px solid ${BORDER}`, color:WHITE, width:28, height:28, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
                </div>
              : <div style={{ marginBottom:14 }}>
                  {showWebcam
                    ? <WebcamCapture
                        onCapture={(base64)=>{ setImgBase64(base64); setImgPreview(`data:image/jpeg;base64,${base64}`); setShowWebcam(false); }}
                        onClose={()=>setShowWebcam(false)}/>
                    : <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                        <button onClick={()=>{ if(isMobile) cameraRef.current?.click(); else setShowWebcam(true); }}
                          style={{ flex:1, background:BLACK, border:`1.5px solid ${RED}`, color:WHITE, padding:"20px 12px", cursor:"pointer", textAlign:"center" }}>
                          <div style={{ fontSize:28, marginBottom:6 }}>📷</div>
                          <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:1 }}>Take Photo</div>
                          <div style={{ fontSize:11, color:"#666", marginTop:3 }}>{isMobile?"Use your camera":"Use your webcam"}</div>
                        </button>
                        <button onClick={()=>!loading&&fileRef.current?.click()}
                          style={{ flex:1, background:BLACK, border:`1.5px solid ${BORDER}`, color:WHITE, padding:"20px 12px", cursor:"pointer", textAlign:"center" }}>
                          <div style={{ fontSize:28, marginBottom:6 }}>🖼️</div>
                          <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:1 }}>Upload Photo</div>
                          <div style={{ fontSize:11, color:"#666", marginTop:3 }}>From your library</div>
                        </button>
                      </div>
                  }
                  <div style={{ fontSize:11, color:MUTED, textAlign:"center" }}>Claude AI will analyze the nutrition facts</div>
                </div>
            }
            <input ref={cameraRef} type="file" accept="image/*" {...(isMobile?{capture:"environment"}:{})} style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
            {imgPreview && !result && (
              <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                <button style={S.btn} onClick={analyzePhoto} disabled={loading}>{loading?"⚡ Analyzing...":"⚡ Analyze with AI"}</button>
              </div>
            )}
            {loading && <div style={{ textAlign:"center", padding:"12px 0", color:MUTED, fontSize:13 }}>🤖 Claude is analyzing your photo...</div>}
            {error && <div style={{ fontSize:12, color:RED, marginBottom:12 }}>{error}</div>}
            {result && (
              <ResultCard result={result} quantity={quantity} onQuantityChange={setQuantity} onAdd={(entry)=>{ quickAdd(entry); onClose(); }}/>
            )}
          </>)}

          {/* ── BARCODE MODE ── */}
          {mode==="barcode" && (<>
            {!barcodeVal && !loading && !result && <BarcodeScanner onDetected={lookupBarcode}/>}
            {loading && (
              <div style={{ textAlign:"center", padding:"30px 0" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:2, color:MUTED }}>
                  {barcodeVal ? `🔍 Looking up barcode ${barcodeVal}...` : "Reading barcode..."}
                </div>
              </div>
            )}
            {error && !loading && (
              <div style={{ fontSize:12, color:RED, textAlign:"center", padding:"10px 0" }}>
                {error}
                <div style={{ marginTop:10 }}>
                  <button style={S.btnSm} onClick={()=>{ setError(""); setBarcodeVal(null); }}>Try Again</button>
                </div>
              </div>
            )}
            {result && (
              <ResultCard
                result={result} quantity={quantity} onQuantityChange={setQuantity}
                onAdd={(entry)=>{ quickAdd(entry); onClose(); }}
                extraBtn={<button style={{ background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"0 14px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" }}
                  onClick={()=>{ setBarcodeVal(null); setResult(null); setError(""); setQuantity(1); }}>Rescan</button>}
              />
            )}
            {!barcodeVal && !result && (
              <div style={{ fontSize:12, color:MUTED, textAlign:"center", marginTop:8 }}>Supports EAN-13, UPC-A, QR Code and more</div>
            )}
          </>)}
        </div>
      </div>
    </div>
  );
}

/* ── SETTINGS PANEL ──────────────────────────────── */
function SettingsPanel({ user, session, profiles, darkMode, onToggleDarkMode, onSaveProfiles, onReset, onExport, onSignOut, onClose }) {
  const activeProfile  = profiles.find(p=>p.isActive) || profiles[0];
  const [editing, setEditing]   = useState(activeProfile?.id || null);
  const [showNew, setShowNew]   = useState(false);
  const [newName, setNewName]   = useState("");
  const [g, setG]               = useState({ ...activeProfile });
  const [tdeeMode, setTdeeMode] = useState(false);
  const [tdee, setTdee]         = useState({ weight:"", height:"", age:"", sex:"male", activity:"moderate" });
  const [tdeeResult, setTdeeResult] = useState(null);
  const [dietSuggest, setDietSuggest] = useState(null); // { diet, calories, protein, carbs, fat }

  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileEdit, setProfileEdit] = useState({ name: user.name||"", goal: user.goal||"recomp" });
  const activityLabels = { sedentary:"Sedentary (desk job)", light:"Light (1-3x/week)", moderate:"Moderate (3-5x/week)", active:"Active (6-7x/week)", veryactive:"Very Active (athlete)" };

  const calcTDEE = () => {
    const wKg = parseFloat(tdee.weight) / 2.205;
    const hCm = parseFloat(tdee.height) * 2.54;
    const age  = parseFloat(tdee.age);
    if (isNaN(wKg)||isNaN(hCm)||isNaN(age)) return;
    const bmr = tdee.sex==="male" ? 10*wKg+6.25*hCm-5*age+5 : 10*wKg+6.25*hCm-5*age-161;
    const maint = Math.round(bmr * activityMultipliers[tdee.activity]);
    const target = user.goal==="cut"?maint-500:user.goal==="bulk"?maint+300:maint;
    const protein = Math.round(parseFloat(tdee.weight)*0.82);
    const fat     = Math.round(target*0.25/9);
    const carbs   = Math.max(0, Math.round((target-protein*4-fat*9)/4));
    setTdeeResult({ calories:target, maintenance:maint, protein, fat, carbs });
    setG(x=>({ ...x, calories:target, protein, fat, carbs }));
  };

  const suggestDietMacros = (diet) => {
    if (!DIET_MACROS[diet]) return;
    const cal = g.calories || activeProfile.calories;
    const pct = DIET_MACROS[diet];
    const protein = Math.round((cal * pct.protein) / 4);
    const carbs   = Math.round((cal * pct.carbs)   / 4);
    const fat     = Math.round((cal * pct.fat)     / 9);
    setDietSuggest({ diet, calories:cal, protein, carbs, fat });
  };

  const applyToActive = (macros) => {
    onSaveProfiles(profiles.map(p => p.isActive ? { ...p, ...macros } : p));
    setG(x=>({ ...x, ...macros }));
    setDietSuggest(null);
  };

  const saveAsNewProfile = (macros, name) => {
    const newProfile = { id:Date.now(), name: name||`${macros.diet||"Custom"} Profile`, ...macros, isActive:false };
    onSaveProfiles([...profiles, newProfile]);
    setDietSuggest(null);
  };

  const setActive = (id) => onSaveProfiles(profiles.map(p=>({...p, isActive:p.id===id})));
  const deleteProfile = (id) => { if(profiles.length<=1) return; onSaveProfiles(profiles.filter(p=>p.id!==id)); };
  const saveEditing = () => onSaveProfiles(profiles.map(p=>p.id===g.id?{...p,...g}:p));
  const createProfile = () => {
    if(!newName.trim()) return;
    const base = { ...activeProfile };
    const newP = { id:Date.now(), name:newName.trim(), calories:base.calories, protein:base.protein, carbs:base.carbs, fat:base.fat, isActive:false };
    onSaveProfiles([...profiles, newP]);
    setNewName(""); setShowNew(false);
    setEditing(newP.id); setG(newP);
  };

  const S = {
    overlay:   { position:"fixed", inset:0, zIndex:600, display:"flex", flexDirection:"column" },
    backdrop:  { flex:1, background:"rgba(0,0,0,0.6)" },
    panel:     { background:BG, maxHeight:"92vh", display:"flex", flexDirection:"column", animation:"slideUp 0.35s cubic-bezier(.22,1,.36,1)" },
    head:      { background:BLACK, padding:"14px 16px 14px", flexShrink:0 },
    body:      { overflowY:"auto", padding:"16px 16px 40px", flex:1 },
    label:     { fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:6 },
    labelRed:  { fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid ${RED}44`, paddingBottom:5 },
    input:     { background:"#F5F4F2", color:"#111111", border:`1px solid ${BORDER}`, borderBottom:`2px solid ${RED}`, borderRadius:0, padding:"9px 10px", fontSize:13, fontFamily:"'DM Sans'", width:"100%", boxSizing:"border-box", outline:"none" },
    row:       { display:"flex", gap:10, marginBottom:14 },
    card:      { background:CARD, border:`1px solid ${BORDER}`, borderLeft:`3px solid ${RED}`, padding:"14px", marginBottom:10 },
    cardBlack: { background:BLACK, border:`1px solid #333`, borderLeft:`3px solid ${RED}`, padding:"12px 14px", marginBottom:10 },
    btn:       { background:RED, color:WHITE, border:"none", borderRadius:0, padding:"13px 16px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnSm:     { background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"7px 12px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" },
    btnSmRed:  { background:"transparent", color:RED, border:`1px solid ${RED}`, borderRadius:0, padding:"7px 12px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" },
    macroInput:{ flex:1, display:"flex", flexDirection:"column", gap:5 },
  };

  const editTarget = profiles.find(p=>p.id===editing) || activeProfile;

  return (
    <div style={S.overlay}>
      <div style={S.backdrop} onClick={onClose}/>
      <div style={S.panel}>
        <div style={S.head}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:WHITE, letterSpacing:2 }}>SETTINGS</div>
              <div style={{ fontSize:10, color:"#444", letterSpacing:1 }}>IZANA MODE · {user.name}</div>
            </div>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", fontSize:20, cursor:"pointer" }}>✕</button>
          </div>
        </div>

        <div style={S.body}>

          {/* ── MACRO PROFILES ── */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={S.labelRed}>📋 MACRO PROFILES</div>
            <button style={S.btnSmRed} onClick={()=>setShowNew(v=>!v)}>+ New</button>
          </div>

          {showNew && (
            <div style={{ ...S.card, display:"flex", gap:8, marginBottom:10 }}>
              <input style={{ ...S.input, flex:1 }} placeholder="Profile name (e.g. Bulk Day)" value={newName} onChange={e=>setNewName(e.target.value)} autoFocus onKeyDown={e=>e.key==="Enter"&&createProfile()}/>
              <button style={S.btnSmRed} onClick={createProfile}>Create</button>
              <button style={S.btnSm} onClick={()=>setShowNew(false)}>✕</button>
            </div>
          )}

          {profiles.map(p=>(
            <div key={p.id} style={{ ...S.card, borderLeft:`3px solid ${p.isActive?RED:BORDER}`, cursor:"pointer", marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }} onClick={()=>{ setEditing(p.id); setG({...p}); }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:1 }}>{p.name}</div>
                    {p.isActive && <span style={{ background:RED, color:WHITE, fontSize:9, padding:"2px 6px", fontFamily:"'Bebas Neue'", letterSpacing:1 }}>ACTIVE</span>}
                  </div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>
                    {p.calories} kcal · P:{p.protein}g · C:{p.carbs}g · F:{p.fat}g
                  </div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {!p.isActive && <button style={S.btnSmRed} onClick={e=>{ e.stopPropagation(); setActive(p.id); }}>Set Active</button>}
                  {profiles.length>1 && <button style={{ ...S.btnSm, color:MUTED }} onClick={e=>{ e.stopPropagation(); deleteProfile(p.id); }}>✕</button>}
                </div>
              </div>

              {/* Inline editor */}
              {editing===p.id && (
                <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${BORDER}` }}>
                  <div style={{ marginBottom:12 }}>
                    <div style={S.label}>PROFILE NAME</div>
                    <input style={S.input} value={g.name||""} onChange={e=>setG(x=>({...x,name:e.target.value}))}/>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={S.label}>CALORIES (kcal)</div>
                    <input style={S.input} type="text" inputMode="numeric" value={g.calories||""} onChange={e=>setG(x=>({...x,calories:parseInt(e.target.value)||0}))}/>
                  </div>
                  <div style={S.row}>
                    <div style={S.macroInput}>
                      <div style={S.label}>PROTEIN (g)</div>
                      <input style={S.input} type="text" inputMode="numeric" value={g.protein||""} onChange={e=>setG(x=>({...x,protein:parseInt(e.target.value)||0}))}/>
                    </div>
                    <div style={S.macroInput}>
                      <div style={S.label}>CARBS (g)</div>
                      <input style={S.input} type="text" inputMode="numeric" value={g.carbs||""} onChange={e=>setG(x=>({...x,carbs:parseInt(e.target.value)||0}))}/>
                    </div>
                    <div style={S.macroInput}>
                      <div style={S.label}>FAT (g)</div>
                      <input style={S.input} type="text" inputMode="numeric" value={g.fat||""} onChange={e=>setG(x=>({...x,fat:parseInt(e.target.value)||0}))}/>
                    </div>
                  </div>

                  {/* Diet type macro suggestion */}
                  <div style={{ marginBottom:12 }}>
                    <div style={S.label}>SUGGEST FROM DIET TYPE</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {Object.keys(DIET_MACROS).map(d=>(
                        <button key={d} onClick={()=>suggestDietMacros(d)}
                          style={{ padding:"5px 10px", fontFamily:"'DM Sans'", fontSize:11, background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, cursor:"pointer" }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diet suggestion confirmation */}
                  {dietSuggest && (
                    <div style={{ ...S.cardBlack, marginBottom:12 }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:RED, letterSpacing:2, marginBottom:8 }}>{dietSuggest.diet.toUpperCase()} SUGGESTION</div>
                      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                        {[["KCAL",dietSuggest.calories,RED],["PROT",dietSuggest.protein+"g",WHITE],["CARB",dietSuggest.carbs+"g",MUTED],["FAT",dietSuggest.fat+"g",RED_DIM]].map(([l,v,c])=>(
                          <div key={l} style={{ flex:1, textAlign:"center" }}>
                            <div style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:c }}>{v}</div>
                            <div style={{ fontSize:9, color:"#555", letterSpacing:1 }}>{l}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button style={{ ...S.btn, flex:1 }} onClick={()=>applyToActive({ calories:dietSuggest.calories, protein:dietSuggest.protein, carbs:dietSuggest.carbs, fat:dietSuggest.fat })}>
                          Apply to This Profile
                        </button>
                        <button style={{ ...S.btnSmRed, flex:1 }} onClick={()=>saveAsNewProfile({ calories:dietSuggest.calories, protein:dietSuggest.protein, carbs:dietSuggest.carbs, fat:dietSuggest.fat, diet:dietSuggest.diet }, `${dietSuggest.diet} Profile`)}>
                          Save as New
                        </button>
                        <button style={S.btnSm} onClick={()=>setDietSuggest(null)}>✕</button>
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize:11, color:MUTED, marginBottom:12, padding:"8px 10px", background:CARD2, borderLeft:`2px solid ${BORDER}` }}>
                    Calories from macros: <strong style={{ color:TEXT }}>{(g.protein||0)*4+(g.carbs||0)*4+(g.fat||0)*9} kcal</strong>
                  </div>
                  <button style={S.btn} onClick={()=>{ saveEditing(); setEditing(null); }}>✓ Save Profile</button>
                </div>
              )}
            </div>
          ))}

          {/* ── TDEE CALCULATOR ── */}
          <div style={{ marginTop:6, marginBottom:6, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={S.labelRed}>🧮 TDEE CALCULATOR</div>
            <button style={S.btnSm} onClick={()=>setTdeeMode(m=>!m)}>{tdeeMode?"▲ Hide":"▼ Calculate"}</button>
          </div>

          {tdeeMode && (
            <div style={S.card}>
              <div style={S.row}>
                <div style={S.macroInput}>
                  <div style={S.label}>WEIGHT (lbs)</div>
                  <input style={S.input} placeholder="185" type="text" inputMode="decimal" value={tdee.weight} onChange={e=>setTdee(t=>({...t,weight:e.target.value}))}/>
                </div>
                <div style={S.macroInput}>
                  <div style={S.label}>HEIGHT (in)</div>
                  <input style={S.input} placeholder="70" type="text" inputMode="decimal" value={tdee.height} onChange={e=>setTdee(t=>({...t,height:e.target.value}))}/>
                </div>
                <div style={S.macroInput}>
                  <div style={S.label}>AGE</div>
                  <input style={S.input} placeholder="25" type="text" inputMode="numeric" value={tdee.age} onChange={e=>setTdee(t=>({...t,age:e.target.value}))}/>
                </div>
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={S.label}>BIOLOGICAL SEX</div>
                <div style={{ display:"flex", gap:8 }}>
                  {["male","female"].map(s=>(
                    <button key={s} onClick={()=>setTdee(t=>({...t,sex:s}))} style={{ flex:1, padding:"9px", fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:1, background:tdee.sex===s?RED:"transparent", color:tdee.sex===s?WHITE:MUTED, border:`1px solid ${tdee.sex===s?RED:BORDER}`, cursor:"pointer" }}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={S.label}>ACTIVITY LEVEL</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {Object.entries(activityLabels).map(([k,v])=>(
                    <button key={k} onClick={()=>setTdee(t=>({...t,activity:k}))} style={{ textAlign:"left", padding:"8px 12px", fontFamily:"'DM Sans'", fontSize:12, background:tdee.activity===k?RED+"18":"transparent", color:tdee.activity===k?RED:MUTED, border:`1px solid ${tdee.activity===k?RED:BORDER}`, cursor:"pointer", borderLeft:tdee.activity===k?`3px solid ${RED}`:`3px solid transparent` }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <button style={S.btn} onClick={calcTDEE}>⚡ Calculate</button>
              {tdeeResult && (
                <div style={{ marginTop:14, background:BLACK, padding:"12px 14px" }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:"#555", letterSpacing:2, marginBottom:8 }}>RESULT — {user.goal?.toUpperCase()}</div>
                  <div style={{ display:"flex", gap:8, marginBottom:10 }}>
                    {[["KCAL",tdeeResult.calories,RED],["PROT",tdeeResult.protein+"g",WHITE],["CARB",tdeeResult.carbs+"g",MUTED],["FAT",tdeeResult.fat+"g",RED_DIM]].map(([l,v,c])=>(
                      <div key={l} style={{ flex:1, textAlign:"center" }}>
                        <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, color:c }}>{v}</div>
                        <div style={{ fontSize:9, color:"#555", letterSpacing:1 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={S.btn} onClick={()=>applyToActive({ calories:tdeeResult.calories, protein:tdeeResult.protein, carbs:tdeeResult.carbs, fat:tdeeResult.fat })}>
                      Apply to Active Profile
                    </button>
                    <button style={S.btnSmRed} onClick={()=>saveAsNewProfile({ calories:tdeeResult.calories, protein:tdeeResult.protein, carbs:tdeeResult.carbs, fat:tdeeResult.fat }, "TDEE Profile")}>
                      Save as New
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── APPEARANCE ── */}
          <div style={{ marginBottom:8 }}>
            <div style={S.labelRed}>🎨 APPEARANCE</div>
            <div style={{ ...S.card, borderLeft:`3px solid ${BORDER}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>Dark Mode</div>
                  <div style={{ fontSize:11, color:MUTED }}>{darkMode?"Full dark theme active":"Light theme active"}</div>
                </div>
                <button onClick={onToggleDarkMode} style={{ background:darkMode?RED:CARD2, border:`1px solid ${darkMode?RED:BORDER}`, color:darkMode?WHITE:TEXT, padding:"8px 16px", fontFamily:"'Bebas Neue'", fontSize:13, letterSpacing:1, cursor:"pointer", borderRadius:0 }}>
                  {darkMode?"🌙 Dark":"☀️ Light"}
                </button>
              </div>
            </div>
          </div>

          {/* ── ACCOUNT ── */}
          <div style={{ marginTop:8 }}>
            <div style={S.labelRed}>👤 ACCOUNT</div>
            <div style={{ ...S.card, borderLeft:`3px solid ${BORDER}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600 }}>{user.name}</div>
                  <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>
                    {session ? "☁️ Cloud sync active" : "📱 Local only — sign in to sync"}
                  </div>
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  {session && <div style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", flexShrink:0 }}/>}
                  <button style={S.btnSm} onClick={()=>setEditingProfile(v=>!v)}>
                    {editingProfile?"✕ Cancel":"✏️ Edit"}
                  </button>
                </div>
              </div>

              {editingProfile&&(
                <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:12, marginBottom:10 }}>
                  <div style={{ marginBottom:10 }}>
                    <div style={S.label}>NAME</div>
                    <input style={S.input} value={profileEdit.name} onChange={e=>setProfileEdit(p=>({...p,name:e.target.value}))} placeholder="Your name"/>
                  </div>
                  <div style={{ marginBottom:12 }}>
                    <div style={S.label}>MISSION</div>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {[["cut","削 Cut"],["bulk","増 Bulk"],["recomp","変 Recomp"],["endure","耐 Endure"]].map(([val,label])=>(
                        <button key={val} onClick={()=>setProfileEdit(p=>({...p,goal:val}))}
                          style={{ padding:"7px 14px", fontFamily:"'DM Sans'", fontSize:12, background:profileEdit.goal===val?RED:CARD2, color:profileEdit.goal===val?WHITE:TEXT, border:`1px solid ${profileEdit.goal===val?RED:BORDER}`, cursor:"pointer" }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button style={S.btn} onClick={()=>{
                    const updated = { ...user, ...profileEdit };
                    lsSet('im_user', updated);
                    window.location.reload();
                  }}>Save Profile</button>
                </div>
              )}

              {onSignOut && <button style={{ ...S.btnSmRed, width:"100%", textAlign:"center", padding:"11px" }} onClick={onSignOut}>
                Sign Out
              </button>}
            </div>
          </div>

          {/* ── MY DATA ── */}
          <div style={{ marginTop:8 }}>
            <div style={S.labelRed}>🗂️ MY DATA</div>
            <div style={{ ...S.card, borderLeft:`3px solid ${BORDER}` }}>
              <div style={{ fontSize:12, color:MUTED, marginBottom:14, lineHeight:1.6 }}>
                Export a full copy of your data, or wipe everything and start fresh.
              </div>

              {/* Export */}
              <button style={{ ...S.btn, background:BLACK, marginBottom:10 }} onClick={onExport}>
                📥 Export My Data
              </button>

              {/* Reset */}
              {!confirmReset
                ? <button style={{ ...S.btnSmRed, width:"100%", textAlign:"center", padding:"11px", marginBottom:8 }}
                    onClick={()=>{ setConfirmReset(true); setConfirmDelete(false); }}>
                    🔄 Reset All My Data
                  </button>
                : <div style={{ background:BLACK, border:`1px solid ${RED}`, padding:"14px", marginBottom:8 }}>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:2, marginBottom:6 }}>ARE YOU SURE?</div>
                    <div style={{ fontSize:12, color:MUTED, marginBottom:14, lineHeight:1.6 }}>
                      This will permanently delete all your food logs, workouts, sleep entries, body metrics, progress photos, and streaks. Your name and goal will be reset. This cannot be undone.
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button style={{ ...S.btn, flex:1, background:RED }} onClick={onReset}>Yes, Reset Everything</button>
                      <button style={{ ...S.btnSm, flex:1, textAlign:"center" }} onClick={()=>setConfirmReset(false)}>Cancel</button>
                    </div>
                  </div>
              }

              {/* Delete Account */}
              {session && <>
                {!confirmDelete
                  ? <button style={{ ...S.btnSm, width:"100%", textAlign:"center", padding:"11px", color:MUTED, borderColor:BORDER }}
                      onClick={()=>{ setConfirmDelete(true); setConfirmReset(false); }}>
                      🗑️ Delete Account Permanently
                    </button>
                  : <div style={{ background:BLACK, border:`1px solid ${RED}`, padding:"14px" }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:2, marginBottom:6 }}>DELETE ACCOUNT?</div>
                      <div style={{ fontSize:12, color:MUTED, marginBottom:14, lineHeight:1.6 }}>
                        This will permanently delete your account and ALL data from our servers. This cannot be undone. You will be signed out immediately.
                      </div>
                      <div style={{ display:"flex", gap:8 }}>
                        <button style={{ ...S.btn, flex:1, background:RED }} disabled={deletingAccount} onClick={async()=>{
                          setDeletingAccount(true);
                          try {
                            const userId = session?.access_token ? JSON.parse(atob(session.access_token.split('.')[1]))?.sub : null;
                            if (userId) await sbDeleteAccount(session.access_token, userId);
                          } catch {}
                          onReset();
                        }}>
                          {deletingAccount ? "Deleting..." : "Yes, Delete Everything"}
                        </button>
                        <button style={{ ...S.btnSm, flex:1, textAlign:"center" }} onClick={()=>setConfirmDelete(false)}>Cancel</button>
                      </div>
                    </div>
                }
              </>}
            </div>
          </div>

          <div style={{ textAlign:"center", padding:"20px 0 0", borderTop:`1px solid ${BORDER}`, marginTop:6 }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:4, color:MUTED }}>IZANA <span style={{ color:RED }}>MODE</span></div>
            <div style={{ fontSize:10, color:MUTED, marginTop:4, letterSpacing:1 }}>王者之道 · WAY OF THE SOVEREIGN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── AUTH SCREEN ─────────────────────────────────── */
function AuthScreen({ onAuth }) {
  const [mode, setMode]       = useState("login"); // login | signup
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [name, setName]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [phase, setPhase]     = useState("in");

  const switchMode = (m) => {
    setPhase("out");
    setTimeout(() => { setMode(m); setPhase("in"); setError(""); }, 300);
  };

  const handleSubmit = async () => {
    setError(""); setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) { setError("Please enter your name."); setLoading(false); return; }
        const res = await sbSignUp(email, password, name);
        if (res.error) { setError(res.error.message); setLoading(false); return; }
        // After signup, sign in to get session
        const loginRes = await sbSignIn(email, password);
        if (loginRes.error) { setError("Account created! Please check your email to confirm, then log in."); setLoading(false); return; }
        onAuth({ session: loginRes, name: name.trim() });
      } else {
        const res = await sbSignIn(email, password);
        if (res.error) { setError(res.error.message); setLoading(false); return; }
        onAuth({ session: res });
      }
    } catch { setError("Something went wrong. Check your connection."); }
    setLoading(false);
  };

  const S = {
    input: { background:"rgba(255,255,255,0.06)", color:WHITE, border:`1px solid #333`, borderBottom:`2px solid ${RED}`, borderRadius:0, padding:"12px 14px", fontSize:14, fontFamily:"'DM Sans'", width:"100%", boxSizing:"border-box", outline:"none" },
    btn:   { background:RED, color:WHITE, border:"none", borderRadius:0, padding:"14px 20px", fontSize:14, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnGoogle: { background:"transparent", color:WHITE, border:`1px solid #333`, borderRadius:0, padding:"12px 20px", fontSize:13, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10 },
    link:  { background:"transparent", border:"none", color:RED, fontSize:12, cursor:"pointer", fontFamily:"'DM Sans'", letterSpacing:0.5, textDecoration:"underline" },
  };

  return (
    <div style={{ position:"fixed", inset:0, background:BLACK, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden", padding:"0 24px" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${RED},${BLACK})` }}/>
      <div style={{ position:"absolute", bottom:-40, right:-40, opacity:0.04 }}><YinYang size={300} className="spin-slow"/></div>

      {/* Logo */}
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <YinYang size={56} style={{ margin:"0 auto 16px" }}/>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:WHITE, letterSpacing:5, lineHeight:1 }}>
          IZANA <span style={{ color:RED }}>MODE</span>
        </div>
        <div style={{ fontSize:10, color:"#444", letterSpacing:3, marginTop:6 }}>王者之道</div>
      </div>

      {/* Form */}
      <div style={{ width:"100%", maxWidth:360, opacity:phase==="out"?0:1, transform:phase==="out"?"translateY(12px)":"translateY(0)", transition:"opacity 0.3s, transform 0.3s" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:4, marginBottom:20, textAlign:"center" }}>
          {mode==="login" ? "SIGN IN TO CONTINUE" : "CREATE YOUR ACCOUNT"}
        </div>

        {/* Google SSO */}
        <button style={S.btnGoogle} onClick={sbSignInGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
          Continue with Google
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"16px 0" }}>
          <div style={{ flex:1, height:1, background:"#222" }}/>
          <span style={{ fontSize:11, color:"#444", letterSpacing:2 }}>OR</span>
          <div style={{ flex:1, height:1, background:"#222" }}/>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {mode==="signup" && (
            <input style={S.input} placeholder="Your name" value={name} onChange={e=>setName(e.target.value)}/>
          )}
          <input style={S.input} placeholder="Email address" type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          <input style={S.input} placeholder="Password" type="password" value={password} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
        </div>

        {error && <div style={{ fontSize:12, color:RED, marginTop:10, lineHeight:1.5, padding:"8px 12px", background:RED+"11", borderLeft:`2px solid ${RED}` }}>{error}</div>}

        <button style={{ ...S.btn, marginTop:16, opacity:loading?0.7:1 }} onClick={handleSubmit} disabled={loading}>
          {loading ? "⚡ Please wait..." : mode==="login" ? "Sign In" : "Create Account"}
        </button>

        <div style={{ textAlign:"center", marginTop:16, fontSize:12, color:"#555" }}>
          {mode==="login"
            ? <>No account? <button style={S.link} onClick={()=>switchMode("signup")}>Create one</button></>
            : <>Already have an account? <button style={S.link} onClick={()=>switchMode("login")}>Sign in</button></>
          }
        </div>
      </div>

      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${BLACK},${RED})` }}/>
    </div>
  );
}

/* ── ONBOARDING ──────────────────────────────────── */
function Onboarding({ onComplete }) {
  const [step,setStep]=useState(0);
  const [name,setName]=useState("");
  const [goal,setGoal]=useState(null);
  const [stats,setStats]=useState({ age:"", weightLbs:"", heightFt:"", heightIn:"", sex:"male", activity:"moderate" });
  const [calcedGoals,setCalcedGoals]=useState(null);
  const [phase,setPhase]=useState("in");
  const advance=(n, tdee)=>{ if(tdee) setCalcedGoals(tdee); setPhase("out"); setTimeout(()=>{ setStep(n); setPhase("in"); },400); };
  const base={ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", opacity:phase==="out"?0:1, transform:phase==="out"?"translateX(-40px)":"translateX(0)",
    transition:"opacity 0.35s ease, transform 0.35s ease", padding:"40px 28px" };

  if(step===0) return (
    <div style={{ position:"fixed", inset:0, background:BLACK, zIndex:1000, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:RED, animation:"lineGrow 2s ease 0.5s forwards", width:0 }}/>
      <div className="spin-in" style={{ marginBottom:36 }}><YinYang size={120}/></div>
      <div style={{ textAlign:"center", animation:"fadeUp 0.8s ease 1.2s both" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:52, color:WHITE, letterSpacing:6, lineHeight:1 }}>IZANA <span style={{ color:RED }}>MODE</span></div>
        <div style={{ fontFamily:"'Noto Serif JP'", fontSize:16, color:"#555", letterSpacing:8, marginTop:8 }}>初代横浜</div>
      </div>
      {["天","代","横","浜"].map((k,i)=>(
        <div key={k} style={{ position:"absolute", fontFamily:"'Bebas Neue'", fontSize:28, color:RED, opacity:0.25,
          animation:`kanjiDrop 0.6s ease ${1.8+i*0.2}s both`,
          top:i<2?20:"auto", bottom:i>=2?100:"auto", left:i%2===0?20:"auto", right:i%2===1?20:"auto" }}>{k}</div>
      ))}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:RED, animation:"lineGrow 2s ease 0.5s forwards", width:0 }}/>
      <button onClick={()=>advance(1)} style={{ position:"absolute", bottom:50, background:"transparent", border:`1px solid #333`, color:"#555", fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:3, padding:"10px 28px", cursor:"pointer", animation:"fadeIn 0.6s ease 2.6s both" }}>ENTER ›</button>
    </div>
  );

  if(step===1) return (
    <div style={{ position:"fixed", inset:0, background:RED, zIndex:1000, overflow:"hidden" }}>
      <div style={{ ...base }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.06 }}>
          <YinYang size={340} className="spin-slow"/>
        </div>
        <div style={{ position:"relative", textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:"rgba(255,255,255,0.6)", letterSpacing:4, marginBottom:20 }}>THE KING OF KINGS COMMANDS</div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:44, color:WHITE, letterSpacing:2, lineHeight:1.1, marginBottom:24 }}>Your body is your<br/><span style={{ color:BLACK }}>battlefield.</span></div>
          <div style={{ width:48, height:2, background:WHITE, margin:"0 auto 24px", opacity:0.5 }}/>
          <p style={{ fontFamily:"'DM Sans'", fontSize:15, color:"rgba(255,255,255,0.75)", lineHeight:1.7, maxWidth:300, margin:"0 auto 36px" }}>
            Track nutrition, training, body metrics, sleep and recovery — planned by AI.
          </p>
          <button onClick={()=>advance(2)} style={{ background:BLACK, color:WHITE, border:"none", fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:3, padding:"16px 40px", cursor:"pointer", width:"100%", maxWidth:300 }}>I'M READY ›</button>
        </div>
      </div>
    </div>
  );

  if(step===2) return (
    <div style={{ position:"fixed", inset:0, background:BLACK, zIndex:1000, overflow:"hidden" }}>
      <div style={{ ...base, justifyContent:"flex-start", paddingTop:60 }}>
        <div style={{ position:"absolute", bottom:-40, right:-40, opacity:0.06 }}><YinYang size={260} className="spin-slow"/></div>
        <div style={{ textAlign:"center", marginBottom:28, width:"100%" }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:4, marginBottom:8 }}>TENJIKU ARSENAL</div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:WHITE, letterSpacing:2, lineHeight:1 }}>YOUR WEAPONS</div>
          <div style={{ height:2, background:RED, marginTop:10 }}/>
        </div>
        {[
          { kanji:"食", en:"Log Food",         desc:"Search, photo scan, or barcode scan any meal. Save favourites for instant re-logging." },
          { kanji:"鍛", en:"Workout Tracker",  desc:"Log sets, reps and weight. Kanji-coded regimens included." },
          { kanji:"体", en:"Body Metrics",     desc:"Track weight and chart your progress over time." },
          { kanji:"眠", en:"Sleep & Recovery", desc:"Log sleep quality and get a daily recovery score." },
          { kanji:"謀", en:"AI Meal Planner",  desc:"Claude builds a personalised 7-day meal plan for your goal." },
        ].map((f,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:16, width:"100%", animation:`fadeUp 0.6s ease ${0.1+i*0.1}s both` }}>
            <div style={{ width:46, height:46, flexShrink:0, background:RED, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue'", fontSize:25, color:WHITE }}>{f.kanji}</div>
            <div><div style={{ fontFamily:"'Bebas Neue'", fontSize:16, color:WHITE, letterSpacing:1, marginBottom:2 }}>{f.en}</div><div style={{ fontFamily:"'DM Sans'", fontSize:12, color:"#666", lineHeight:1.5 }}>{f.desc}</div></div>
          </div>
        ))}
        <button onClick={()=>advance(3)} style={{ background:RED, color:WHITE, border:"none", fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:3, padding:"16px 40px", cursor:"pointer", width:"100%", marginTop:6 }}>NEXT ›</button>
      </div>
    </div>
  );

  if(step===3) return (
    <div style={{ position:"fixed", inset:0, background:WHITE, zIndex:1000, overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${RED},${BLACK})` }}/>
      <div style={{ ...base, justifyContent:"flex-start", paddingTop:60, overflowY:"auto" }}>
        <div style={{ textAlign:"center", marginBottom:28, width:"100%" }}>
          <YinYang size={44} style={{ margin:"0 auto 16px", mixBlendMode:"multiply" }}/>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:MUTED, letterSpacing:4, marginBottom:6 }}>IDENTIFY YOURSELF</div>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:34, color:TEXT, letterSpacing:2 }}>WHO TRAINS TODAY?</div>
          <div style={{ height:2, background:RED, marginTop:10 }}/>
        </div>

        {/* Name */}
        <div style={{ width:"100%", marginBottom:20 }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:3, marginBottom:8 }}>YOUR NAME</div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name..."
            style={{ width:"100%", boxSizing:"border-box", background:"transparent", color:TEXT, border:"none", borderBottom:`2px solid ${name?RED:BORDER}`, fontFamily:"'Bebas Neue'", fontSize:24, letterSpacing:2, padding:"8px 0", outline:"none", transition:"border-color 0.3s" }}/>
        </div>

        {/* Goal */}
        <div style={{ width:"100%", marginBottom:20 }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:3, marginBottom:12 }}>YOUR MISSION</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[{ id:"cut", kanji:"削", label:"Cut", sub:"Lose fat" },{ id:"bulk", kanji:"増", label:"Bulk", sub:"Build mass" },{ id:"recomp", kanji:"変", label:"Recomp", sub:"Transform" },{ id:"endure", kanji:"耐", label:"Endure", sub:"Build stamina" }].map(g=>(
              <button key={g.id} onClick={()=>setGoal(g.id)} style={{ background:goal===g.id?RED:"transparent", border:`1.5px solid ${goal===g.id?RED:BORDER}`, borderRadius:0, padding:"14px 12px", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:30, color:goal===g.id?WHITE:RED, lineHeight:1, marginBottom:4 }}>{g.kanji}</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, color:goal===g.id?WHITE:TEXT, letterSpacing:1 }}>{g.label}</div>
                <div style={{ fontFamily:"'DM Sans'", fontSize:11, color:goal===g.id?"rgba(255,255,255,0.7)":MUTED, marginTop:2 }}>{g.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats for TDEE */}
        <div style={{ width:"100%", marginBottom:20 }}>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:3, marginBottom:4 }}>YOUR STATS <span style={{ fontSize:10, color:MUTED, letterSpacing:1 }}>(for calorie targets)</span></div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
            <div>
              <div style={{ fontSize:10, color:MUTED, letterSpacing:1, marginBottom:4 }}>AGE</div>
              <input value={stats.age} onChange={e=>setStats(s=>({...s,age:e.target.value}))} placeholder="e.g. 28" type="text" inputMode="numeric" pattern="[0-9]*"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", color:TEXT, border:"none", borderBottom:`2px solid ${stats.age?RED:BORDER}`, fontFamily:"'DM Sans'", fontSize:16, padding:"6px 0", outline:"none" }}/>
            </div>
            <div>
              <div style={{ fontSize:10, color:MUTED, letterSpacing:1, marginBottom:4 }}>WEIGHT (lbs)</div>
              <input value={stats.weightLbs} onChange={e=>setStats(s=>({...s,weightLbs:e.target.value}))} placeholder="e.g. 185" type="text" inputMode="decimal" pattern="[0-9]*"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", color:TEXT, border:"none", borderBottom:`2px solid ${stats.weightLbs?RED:BORDER}`, fontFamily:"'DM Sans'", fontSize:16, padding:"6px 0", outline:"none" }}/>
            </div>
            <div>
              <div style={{ fontSize:10, color:MUTED, letterSpacing:1, marginBottom:4 }}>HEIGHT (ft)</div>
              <input value={stats.heightFt} onChange={e=>setStats(s=>({...s,heightFt:e.target.value}))} placeholder="e.g. 5" type="text" inputMode="numeric" pattern="[0-9]*"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", color:TEXT, border:"none", borderBottom:`2px solid ${stats.heightFt?RED:BORDER}`, fontFamily:"'DM Sans'", fontSize:16, padding:"6px 0", outline:"none" }}/>
            </div>
            <div>
              <div style={{ fontSize:10, color:MUTED, letterSpacing:1, marginBottom:4 }}>HEIGHT (in)</div>
              <input value={stats.heightIn} onChange={e=>setStats(s=>({...s,heightIn:e.target.value}))} placeholder="e.g. 10" type="text" inputMode="numeric" pattern="[0-9]*"
                style={{ width:"100%", boxSizing:"border-box", background:"transparent", color:TEXT, border:"none", borderBottom:`2px solid ${stats.heightIn?RED:BORDER}`, fontFamily:"'DM Sans'", fontSize:16, padding:"6px 0", outline:"none" }}/>
            </div>
          </div>
          {/* Sex */}
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            {["male","female"].map(s=>(
              <button key={s} onClick={()=>setStats(st=>({...st,sex:s}))}
                style={{ flex:1, padding:"8px", background:stats.sex===s?BLACK:"transparent", color:stats.sex===s?WHITE:TEXT, border:`1px solid ${stats.sex===s?BLACK:BORDER}`, fontFamily:"'Bebas Neue'", fontSize:13, letterSpacing:1, cursor:"pointer" }}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          {/* Activity */}
          <div style={{ fontSize:10, color:MUTED, letterSpacing:1, marginBottom:6 }}>ACTIVITY LEVEL</div>
          {Object.entries(ACTIVITY_LEVELS).map(([k,v])=>(
            <button key={k} onClick={()=>setStats(s=>({...s,activity:k}))}
              style={{ width:"100%", textAlign:"left", padding:"8px 10px", marginBottom:4, background:stats.activity===k?RED+"15":"transparent", color:stats.activity===k?RED:MUTED, border:`1px solid ${stats.activity===k?RED:BORDER}`, borderLeft:`3px solid ${stats.activity===k?RED:"transparent"}`, fontFamily:"'DM Sans'", fontSize:12, cursor:"pointer" }}>
              {v.label}
            </button>
          ))}
        </div>

        <button onClick={()=>{
          if(!name||!goal) return;
          const heightIn = stats.heightFt && (parseFloat(stats.heightFt)*12 + parseFloat(stats.heightIn||0));
          const tdee = calcTDEE({ ...stats, heightIn, goal });
          advance(4, tdee);
        }} style={{ background:name&&goal?RED:CARD2, color:name&&goal?WHITE:MUTED, border:"none", borderRadius:0, fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:2, padding:"16px", cursor:name&&goal?"pointer":"not-allowed", width:"100%", transition:"all 0.3s", marginBottom:8 }}>
          {name&&goal?`ENTER THE DOJO, ${name.toUpperCase()} ›`:"FILL IN NAME & MISSION FIRST"}
        </button>
        <div style={{ textAlign:"center", fontSize:11, color:MUTED, paddingBottom:20 }}>Stats optional — you can set targets in Settings later</div>
      </div>
    </div>
  );

  if(step===4) return <FinalTransition name={name} goal={goal} calcedGoals={calcedGoals} onComplete={onComplete}/>;
  return null;
}

function FinalTransition({ name, goal, calcedGoals, onComplete }) {
  const [sub,setSub]=useState(0);
  useEffect(()=>{ const t1=setTimeout(()=>setSub(1),600), t2=setTimeout(()=>setSub(2),1800), t3=setTimeout(()=>onComplete({name,goal,calcedGoals}),3200); return ()=>{ clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); }; },[]);
  return (
    <div style={{ position:"fixed", inset:0, background:BLACK, zIndex:1000, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <YinYang size={100} className="spin-in" style={{ marginBottom:32 }}/>
      {sub>=1&&<div style={{ textAlign:"center", animation:"fadeUp 0.6s ease both" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, color:RED, letterSpacing:4, marginBottom:6 }}>TENJIKU WELCOMES</div>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:48, color:WHITE, letterSpacing:3, lineHeight:1 }}>{name.toUpperCase()}</div>
      </div>}
      {sub>=2&&<div style={{ textAlign:"center", marginTop:24, animation:"fadeUp 0.5s ease both" }}>
        <div style={{ fontFamily:"'DM Sans'", fontSize:14, color:"#555", marginBottom:16 }}>Initializing your regimen...</div>
        <div style={{ width:200, height:2, background:"#222", overflow:"hidden" }}><div style={{ height:"100%", background:RED, animation:"lineGrow 1.2s ease forwards" }}/></div>
      </div>}
      {["天","代","横","浜"].map((k,i)=>(<div key={k} style={{ position:"absolute", fontFamily:"'Bebas Neue'", fontSize:22, color:RED, opacity:0.2, top:i<2?24:"auto", bottom:i>=2?24:"auto", left:i%2===0?24:"auto", right:i%2===1?24:"auto" }}>{k}</div>))}
    </div>
  );
}

/* ── RANK UP CELEBRATION ─────────────────────────── */
function RankUpCelebration({ rank, onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,3500); return ()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:"fixed", inset:0, background:BLACK, zIndex:2000, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", overflow:"hidden" }}
      onClick={onDone}>
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(circle at center, ${rank.color}22 0%, transparent 70%)` }}/>
      <div style={{ fontFamily:"'Bebas Neue'", fontSize:120, color:rank.color, lineHeight:1, animation:"rankPulse 0.8s cubic-bezier(.22,1,.36,1) forwards", marginBottom:8 }}>{rank.kanji}</div>
      <div style={{ textAlign:"center", animation:"rankShine 0.6s ease 0.5s both" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:"#555", letterSpacing:5, marginBottom:8 }}>RANK UP</div>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:38, color:WHITE, letterSpacing:3, lineHeight:1 }}>{rank.sub}</div>
        <div style={{ fontFamily:"'DM Sans'", fontSize:13, color:rank.color, marginTop:8, letterSpacing:2 }}>{rank.title}</div>
      </div>
      {["天","代","横","浜"].map((k,i)=>(<div key={k} style={{ position:"absolute", fontFamily:"'Bebas Neue'", fontSize:28, color:rank.color, opacity:0.2, animation:`kanjiDrop 0.5s ease ${0.3+i*0.15}s both`, top:i<2?20:"auto", bottom:i>=2?20:"auto", left:i%2===0?20:"auto", right:i%2===1?20:"auto" }}>{k}</div>))}
      <div style={{ position:"absolute", bottom:40, fontSize:11, color:"#333", letterSpacing:2 }}>TAP TO CONTINUE</div>
    </div>
  );
}

/* ── MAIN APP ────────────────────────────────────── */
const DEFAULT_GOALS = { calories:2000, protein:150, carbs:200, fat:65 };
const SAMPLE_WORKOUTS = [
  { id:"push",  name:"推 — Push",        exercises:["Bench Press","Incline Dumbbell Press","Overhead Press","Lateral Raises","Tricep Pushdowns","Skull Crushers"] },
  { id:"pull",  name:"引 — Pull",        exercises:["Deadlift","Pull-Ups","Barbell Row","Face Pulls","Bicep Curls","Hammer Curls"] },
  { id:"legs",  name:"脚 — Legs",        exercises:["Squat","Romanian Deadlift","Leg Press","Leg Curl","Leg Extension","Calf Raises"] },
  { id:"upper", name:"上 — Upper Body",  exercises:["Bench Press","Barbell Row","Overhead Press","Pull-Ups","Lateral Raises","Tricep Dips"] },
  { id:"lower", name:"下 — Lower Body",  exercises:["Squat","Romanian Deadlift","Leg Press","Leg Curl","Hip Thrust","Calf Raises"] },
];

const EXERCISE_LIBRARY = {
  "Chest":      ["Bench Press","Incline Bench Press","Decline Bench Press","Incline Dumbbell Press","Dumbbell Fly","Cable Fly","Push-Ups","Dips","Chest Press Machine","Pec Deck"],
  "Back":       ["Deadlift","Pull-Ups","Chin-Ups","Barbell Row","Dumbbell Row","Cable Row","Lat Pulldown","Face Pulls","T-Bar Row","Rack Pull"],
  "Shoulders":  ["Overhead Press","Dumbbell OHP","Lateral Raises","Front Raises","Rear Delt Fly","Arnold Press","Upright Row","Cable Lateral Raise","Machine Shoulder Press"],
  "Arms":       ["Bicep Curls","Hammer Curls","Preacher Curl","Cable Curl","Incline Dumbbell Curl","Tricep Pushdowns","Skull Crushers","Overhead Tricep Extension","Close Grip Bench","Dips"],
  "Legs":       ["Squat","Front Squat","Romanian Deadlift","Leg Press","Leg Curl","Leg Extension","Hip Thrust","Bulgarian Split Squat","Lunges","Calf Raises","Hack Squat","Sumo Deadlift"],
  "Core":       ["Plank","Crunches","Leg Raises","Russian Twist","Ab Wheel","Cable Crunch","Hanging Knee Raise","Side Plank","Dead Bug","Pallof Press"],
  "Compound":   ["Deadlift","Squat","Bench Press","Overhead Press","Pull-Ups","Barbell Row","Power Clean","Push Press","Farmer Carry"],
};

// Muscle groups used in SVG diagram
// Each exercise maps to: primary muscles (highlighted red), secondary (highlighted pink), tips
const EXERCISE_INFO = {
  "Bench Press":              { primary:["chest"], secondary:["triceps","front_delt"], tips:["Keep shoulder blades retracted and depressed","Plant feet flat on floor","Bar should touch mid-chest","Drive through your legs as you press"] },
  "Incline Bench Press":      { primary:["upper_chest"], secondary:["front_delt","triceps"], tips:["Set bench to 30-45 degrees","Bar touches upper chest","Wider grip emphasizes chest more","Control the descent"] },
  "Decline Bench Press":      { primary:["lower_chest"], secondary:["triceps","front_delt"], tips:["Use a spotter — blood rushes to head","Bar touches lower chest","Great for chest thickness","Feet locked into pad"] },
  "Incline Dumbbell Press":   { primary:["upper_chest"], secondary:["front_delt","triceps"], tips:["Dumbbells allow greater range of motion","Touch dumbbells at top","Don't flare elbows too wide","Slow eccentric builds more muscle"] },
  "Dumbbell Fly":             { primary:["chest"], secondary:["front_delt"], tips:["Slight bend in elbows throughout","Feel the stretch at the bottom","Don't go too heavy — injury risk","Squeeze chest hard at top"] },
  "Cable Fly":                { primary:["chest"], secondary:["front_delt"], tips:["Cables keep constant tension","Cross hands at finish for full contraction","Keep slight forward lean","Great finisher after pressing"] },
  "Push-Ups":                 { primary:["chest"], secondary:["triceps","front_delt","core"], tips:["Keep core tight throughout","Hands slightly wider than shoulders","Full range of motion — chest to floor","Elevate feet for upper chest emphasis"] },
  "Chest Press Machine":      { primary:["chest"], secondary:["triceps","front_delt"], tips:["Adjust seat so handles are at chest height","Great for beginners — stable movement","Focus on squeezing at peak contraction","Control the weight back"] },
  "Pec Deck":                 { primary:["chest"], secondary:["front_delt"], tips:["Great isolation movement","Don't let elbows go too far back","Squeeze hard for 1-2 seconds at peak","Good finisher for pump"] },
  "Deadlift":                 { primary:["lower_back","hamstrings","glutes"], secondary:["traps","lats","quads","core"], tips:["Hinge at hips — not a squat","Bar stays in contact with legs","Brace core hard before pulling","Keep chest up, back flat"] },
  "Pull-Ups":                 { primary:["lats"], secondary:["biceps","rear_delt","traps"], tips:["Dead hang at bottom for full stretch","Drive elbows to hips","Shoulder-width or wider grip","Cross feet to reduce swinging"] },
  "Chin-Ups":                 { primary:["lats","biceps"], secondary:["rear_delt"], tips:["Underhand grip hits biceps more","Full hang at bottom","Pull until chin clears bar","Supinated grip = more bicep involvement"] },
  "Barbell Row":              { primary:["lats","mid_back"], secondary:["biceps","rear_delt","traps"], tips:["Hinge to about 45 degrees","Pull bar to lower chest/upper abs","Squeeze shoulder blades at top","Don't use momentum"] },
  "Dumbbell Row":             { primary:["lats","mid_back"], secondary:["biceps","rear_delt"], tips:["Support with same-side knee and hand","Pull elbow up and back","Don't rotate torso","Full stretch at bottom"] },
  "Cable Row":                { primary:["mid_back","lats"], secondary:["biceps","rear_delt"], tips:["Sit tall — don't lean back excessively","Pull to lower abdomen","Squeeze shoulder blades together","Control the return"] },
  "Lat Pulldown":             { primary:["lats"], secondary:["biceps","rear_delt"], tips:["Lean back slightly — not excessively","Pull bar to upper chest","Focus on driving elbows down","Full stretch at top"] },
  "Face Pulls":               { primary:["rear_delt"], secondary:["traps","rotator_cuff"], tips:["Pull to face level — not neck","External rotation at end position","Great for shoulder health","Light weight, high reps"] },
  "T-Bar Row":                { primary:["mid_back","lats"], secondary:["biceps","rear_delt"], tips:["Chest on pad keeps spine safe","Pull handles to chest","Great for mid-back thickness","Squeeze at top"] },
  "Overhead Press":           { primary:["front_delt","side_delt"], secondary:["triceps","traps","upper_chest"], tips:["Brace core — protect lower back","Bar path slightly back over head","Flare elbows slightly at bottom","Lock out at top"] },
  "Dumbbell OHP":             { primary:["front_delt","side_delt"], secondary:["triceps"], tips:["Greater range of motion than barbell","Neutral or pronated grip both work","Keep core tight throughout","Don't arch lower back"] },
  "Lateral Raises":           { primary:["side_delt"], secondary:[], tips:["Slight bend in elbows","Lead with elbows — not wrists","Stop at shoulder height","Light weight, strict form — no swinging"] },
  "Front Raises":             { primary:["front_delt"], secondary:["upper_chest"], tips:["Raise to shoulder height only","Alternate arms or both together","Keep slight bend in elbow","Control the descent"] },
  "Rear Delt Fly":            { primary:["rear_delt"], secondary:["traps","mid_back"], tips:["Hinge forward 90 degrees","Lead with elbows","Squeeze shoulder blades at top","Light weight for proper isolation"] },
  "Arnold Press":             { primary:["front_delt","side_delt"], secondary:["triceps"], tips:["Rotate palms out as you press","Named after Arnold Schwarzenegger","Hits all three delt heads","Don't rush the rotation"] },
  "Bicep Curls":              { primary:["biceps"], secondary:["forearms"], tips:["Keep elbows pinned to sides","Full range — extend fully at bottom","Supinate wrist at top","Don't swing — no momentum"] },
  "Hammer Curls":             { primary:["biceps","brachialis"], secondary:["forearms"], tips:["Neutral grip throughout","Targets brachialis for arm width","Can do alternating or together","Keep elbows stationary"] },
  "Preacher Curl":            { primary:["biceps"], secondary:[], tips:["Fully isolates biceps — no cheating","Don't hyperextend at bottom","Slow eccentric phase","Great for bicep peak"] },
  "Tricep Pushdowns":         { primary:["triceps"], secondary:[], tips:["Keep elbows pinned to sides","Fully extend at bottom","Bar, rope, or V-bar all work","Don't lean forward excessively"] },
  "Skull Crushers":           { primary:["triceps"], secondary:[], tips:["Lower bar to forehead or behind head","Keep upper arms vertical","EZ bar is easier on wrists","Great for tricep mass"] },
  "Overhead Tricep Extension":{ primary:["triceps"], secondary:[], tips:["Hits long head of tricep best","Keep elbows pointed forward","Full stretch at bottom","Don't let elbows flare out"] },
  "Close Grip Bench":         { primary:["triceps"], secondary:["chest","front_delt"], tips:["Shoulder-width grip — not too close","Lower to lower chest","Keep elbows tucked in","Great mass builder for triceps"] },
  "Squat":                    { primary:["quads","glutes"], secondary:["hamstrings","lower_back","core"], tips:["Break parallel for full development","Knees track over toes","Brace core hard before descent","Drive through heels"] },
  "Front Squat":              { primary:["quads"], secondary:["glutes","core"], tips:["Elbows high in front rack","More upright torso than back squat","Core must be very strong","Clean grip or cross-arm grip"] },
  "Romanian Deadlift":        { primary:["hamstrings","glutes"], secondary:["lower_back"], tips:["Hinge at hips — soft knee bend","Bar stays close to legs","Feel stretch in hamstrings","Don't round lower back"] },
  "Leg Press":                { primary:["quads","glutes"], secondary:["hamstrings"], tips:["Don't lock knees at top","Foot position changes emphasis","High feet = more glutes","Low feet = more quads"] },
  "Leg Curl":                 { primary:["hamstrings"], secondary:[], tips:["Full range of motion","Squeeze at peak contraction","Don't let hips rise off pad","Slow eccentric for growth"] },
  "Leg Extension":            { primary:["quads"], secondary:[], tips:["Full extension at top","Hold 1 second at peak","Don't swing weight up","Good warm-up or finisher"] },
  "Hip Thrust":               { primary:["glutes"], secondary:["hamstrings"], tips:["Bar across hip crease with a pad for comfort","Drive through heels to full hip extension","Bench at mid-back height — chin tucked","Squeeze glutes hard and hold 1 second at top"] },
  "Bulgarian Split Squat":    { primary:["quads","glutes"], secondary:["hamstrings","core"], tips:["Rear foot elevated on bench","Most of weight on front leg","Keep torso upright","Humbling exercise — go light first"] },
  "Lunges":                   { primary:["quads","glutes"], secondary:["hamstrings","core"], tips:["Step long enough to get 90-degree knee","Keep front shin vertical","Can do walking or stationary","Don't let back knee slam floor"] },
  "Calf Raises":              { primary:["calves"], secondary:[], tips:["Full range — stretch at bottom","Hold at top for 1 second","Standing hits gastrocnemius more","Seated hits soleus more"] },
  "Plank":                    { primary:["core"], secondary:["glutes","shoulders"], tips:["Body in straight line","Don't let hips sag or pike","Breathe steadily throughout","Progress to weighted or RKC plank"] },
  "Crunches":                 { primary:["core"], secondary:[], tips:["Don't pull on neck","Exhale as you crunch up","Short range of motion is fine","Quality over quantity"] },
  "Leg Raises":               { primary:["core"], secondary:["hip_flexors"], tips:["Lower back stays pressed to bench","Control the descent","Tilt pelvis at top for full contraction","Bent knees makes it easier"] },
  "Power Clean":              { primary:["quads","glutes","traps"], secondary:["hamstrings","core","shoulders"], tips:["Triple extension: ankles, knees, hips","Catch in quarter squat","Technically demanding — learn from a coach","Great for athleticism and power"] },
  "Farmer Carry":             { primary:["traps","forearms","core"], secondary:["glutes","quads"], tips:["Stand tall — don't lean","Take short quick steps","Great for grip and core stability","Go heavy and far"] },
};

/* ── MUSCLE BODY DIAGRAM ─────────────────────────── */
function MuscleBodyDiagram({ primary=[], secondary=[] }) {
  const c  = (m) => primary.includes(m) ? RED : secondary.includes(m) ? "#E8836B" : "#2a2a2a";
  const cs = (m) => primary.includes(m) ? RED : secondary.includes(m) ? "#c06040" : "#3a3a3a";
  return (
    <svg viewBox="0 0 220 242" width="100%" style={{ maxHeight:300, display:"block", margin:"0 auto" }}>
      {/* FRONT */}
      <ellipse cx="60" cy="18" rx="12" ry="14" fill="#222" stroke="#444" strokeWidth="0.8"/>
      <path d="M55,30 Q60,36 65,30 L66,40 Q60,44 54,40 Z" fill="#1e1e1e" stroke="#333" strokeWidth="0.5"/>
      <path d="M34,47 Q24,50 22,60 Q22,70 30,72 Q36,70 38,62 Q38,52 34,47 Z" fill={c("front_delt")} stroke={cs("front_delt")} strokeWidth="0.6"/>
      <path d="M86,47 Q96,50 98,60 Q98,70 90,72 Q84,70 82,62 Q82,52 86,47 Z" fill={c("front_delt")} stroke={cs("front_delt")} strokeWidth="0.6"/>
      <ellipse cx="22" cy="61" rx="5" ry="7" fill={c("side_delt")} stroke={cs("side_delt")} strokeWidth="0.5"/>
      <ellipse cx="98" cy="61" rx="5" ry="7" fill={c("side_delt")} stroke={cs("side_delt")} strokeWidth="0.5"/>
      <path d="M38,44 Q60,38 82,44 Q86,56 78,64 Q60,68 42,64 Q34,56 38,44 Z" fill={c("upper_chest")} stroke={cs("upper_chest")} strokeWidth="0.6"/>
      <path d="M40,62 Q60,68 80,62 Q80,76 70,80 Q60,83 50,80 Q40,76 40,62 Z" fill={primary.includes("chest")||primary.includes("lower_chest")?RED:secondary.includes("chest")||secondary.includes("lower_chest")?"#E8836B":"#2a2a2a"} stroke={primary.includes("chest")||primary.includes("lower_chest")?RED:secondary.includes("chest")||secondary.includes("lower_chest")?"#c06040":"#3a3a3a"} strokeWidth="0.6"/>
      <path d="M24,66 Q19,72 19,82 Q19,92 24,95 Q28,96 31,91 Q33,84 32,74 Q31,66 27,64 Z" fill={c("biceps")} stroke={cs("biceps")} strokeWidth="0.5"/>
      <path d="M96,66 Q101,72 101,82 Q101,92 96,95 Q92,96 89,91 Q87,84 88,74 Q89,66 93,64 Z" fill={c("biceps")} stroke={cs("biceps")} strokeWidth="0.5"/>
      <path d="M20,95 Q17,103 17,112 Q18,119 22,120 Q26,120 28,116 Q30,108 29,100 Q28,94 24,93 Z" fill={c("forearms")} stroke={cs("forearms")} strokeWidth="0.5"/>
      <path d="M100,95 Q103,103 103,112 Q102,119 98,120 Q94,120 92,116 Q90,108 91,100 Q92,94 96,93 Z" fill={c("forearms")} stroke={cs("forearms")} strokeWidth="0.5"/>
      <path d="M48,80 Q60,77 72,80 L72,90 Q60,93 48,90 Z" fill={c("core")} stroke={cs("core")} strokeWidth="0.5"/>
      <path d="M48,92 Q60,89 72,92 L72,102 Q60,105 48,102 Z" fill={c("core")} stroke={cs("core")} strokeWidth="0.5" opacity="0.9"/>
      <path d="M48,104 Q60,101 72,104 L72,114 Q60,117 48,114 Z" fill={c("core")} stroke={cs("core")} strokeWidth="0.5" opacity="0.8"/>
      <line x1="60" y1="80" x2="60" y2="116" stroke="#1a1a1a" strokeWidth="1.5"/>
      <path d="M40,86 Q44,96 43,110 Q40,116 39,118 Q36,110 37,98 Z" fill={c("core")} stroke={cs("core")} strokeWidth="0.4" opacity="0.6"/>
      <path d="M80,86 Q76,96 77,110 Q80,116 81,118 Q84,110 83,98 Z" fill={c("core")} stroke={cs("core")} strokeWidth="0.4" opacity="0.6"/>
      <path d="M42,116 Q60,120 78,116 Q80,126 76,130 Q60,134 44,130 Q40,126 42,116 Z" fill="#222" stroke="#333" strokeWidth="0.5"/>
      <path d="M44,130 Q38,136 37,152 Q36,165 40,170 Q46,175 51,169 Q54,160 53,146 Q52,134 46,130 Z" fill={c("quads")} stroke={cs("quads")} strokeWidth="0.6"/>
      <path d="M50,130 Q55,134 56,150 Q56,163 52,170 Q47,175 44,170 Q40,163 41,150 Q42,136 46,130 Z" fill={c("quads")} stroke={cs("quads")} strokeWidth="0.6" opacity="0.85"/>
      <path d="M76,130 Q82,136 83,152 Q84,165 80,170 Q74,175 69,169 Q66,160 67,146 Q68,134 74,130 Z" fill={c("quads")} stroke={cs("quads")} strokeWidth="0.6"/>
      <path d="M70,130 Q65,134 64,150 Q64,163 68,170 Q73,175 76,170 Q80,163 79,150 Q78,136 74,130 Z" fill={c("quads")} stroke={cs("quads")} strokeWidth="0.6" opacity="0.85"/>
      <ellipse cx="47" cy="172" rx="8" ry="6" fill="#1e1e1e" stroke="#3a3a3a" strokeWidth="0.5"/>
      <ellipse cx="73" cy="172" rx="8" ry="6" fill="#1e1e1e" stroke="#3a3a3a" strokeWidth="0.5"/>
      <path d="M40,178 Q36,188 37,202 Q38,212 43,215 Q47,216 50,212 Q52,203 51,190 Q49,180 44,177 Z" fill={c("calves")} stroke={cs("calves")} strokeWidth="0.5"/>
      <path d="M70,178 Q74,188 73,202 Q72,212 67,215 Q63,216 60,212 Q58,203 59,190 Q61,180 66,177 Z" fill={c("calves")} stroke={cs("calves")} strokeWidth="0.5"/>
      <ellipse cx="44" cy="217" rx="8" ry="4" fill="#1a1a1a" stroke="#333" strokeWidth="0.4"/>
      <ellipse cx="67" cy="217" rx="8" ry="4" fill="#1a1a1a" stroke="#333" strokeWidth="0.4"/>
      <text x="57" y="233" textAnchor="middle" style={{ fontSize:7, fill:"#555", fontFamily:"'DM Sans'", letterSpacing:2 }}>FRONT</text>

      {/* BACK */}
      <ellipse cx="163" cy="18" rx="12" ry="14" fill="#222" stroke="#444" strokeWidth="0.8"/>
      <path d="M158,30 Q163,36 168,30 L169,40 Q163,44 157,40 Z" fill="#1e1e1e" stroke="#333" strokeWidth="0.5"/>
      <path d="M140,42 Q163,36 186,42 Q190,52 184,60 Q174,56 163,55 Q152,56 142,60 Q136,52 140,42 Z" fill={c("traps")} stroke={cs("traps")} strokeWidth="0.6"/>
      <path d="M132,50 Q122,53 120,63 Q120,72 128,74 Q134,72 136,63 Q136,52 132,50 Z" fill={c("rear_delt")} stroke={cs("rear_delt")} strokeWidth="0.6"/>
      <path d="M194,50 Q204,53 206,63 Q206,72 198,74 Q192,72 190,63 Q190,52 194,50 Z" fill={c("rear_delt")} stroke={cs("rear_delt")} strokeWidth="0.6"/>
      <path d="M123,68 Q119,76 119,86 Q119,96 123,98 Q127,99 130,94 Q132,86 131,76 Q130,68 126,66 Z" fill={c("triceps")} stroke={cs("triceps")} strokeWidth="0.5"/>
      <path d="M203,68 Q207,76 207,86 Q207,96 203,98 Q199,99 196,94 Q194,86 195,76 Q196,68 200,66 Z" fill={c("triceps")} stroke={cs("triceps")} strokeWidth="0.5"/>
      <path d="M120,98 Q117,106 117,114 Q118,120 122,121 Q126,120 128,114 Q129,106 127,98 Z" fill={c("forearms")} stroke={cs("forearms")} strokeWidth="0.5"/>
      <path d="M206,98 Q209,106 209,114 Q208,120 204,121 Q200,120 198,114 Q197,106 199,98 Z" fill={c("forearms")} stroke={cs("forearms")} strokeWidth="0.5"/>
      <path d="M137,56 Q130,66 128,82 Q127,96 132,106 Q138,112 144,108 Q148,98 147,82 Q147,66 141,56 Z" fill={c("lats")} stroke={cs("lats")} strokeWidth="0.6"/>
      <path d="M189,56 Q196,66 198,82 Q199,96 194,106 Q188,112 182,108 Q178,98 179,82 Q179,66 185,56 Z" fill={c("lats")} stroke={cs("lats")} strokeWidth="0.6"/>
      <path d="M144,56 Q163,52 182,56 Q184,68 182,76 Q163,80 144,76 Q142,68 144,56 Z" fill={c("mid_back")} stroke={cs("mid_back")} strokeWidth="0.6"/>
      <path d="M150,86 Q163,82 176,86 Q178,100 176,112 Q163,116 150,112 Q148,100 150,86 Z" fill={c("lower_back")} stroke={cs("lower_back")} strokeWidth="0.6"/>
      <path d="M146,116 Q138,122 136,134 Q136,147 142,151 Q150,155 157,151 Q162,144 160,132 Q158,120 150,115 Z" fill={c("glutes")} stroke={cs("glutes")} strokeWidth="0.6"/>
      <path d="M180,116 Q188,122 190,134 Q190,147 184,151 Q176,155 169,151 Q164,144 166,132 Q168,120 176,115 Z" fill={c("glutes")} stroke={cs("glutes")} strokeWidth="0.6"/>
      <path d="M138,150 Q132,158 132,170 Q132,180 136,184 Q142,188 147,183 Q150,174 149,162 Q148,152 142,149 Z" fill={c("hamstrings")} stroke={cs("hamstrings")} strokeWidth="0.6"/>
      <path d="M147,149 Q151,158 150,172 Q150,183 146,186 Q140,188 137,184 Q133,178 133,168 Q133,156 140,150 Z" fill={c("hamstrings")} stroke={cs("hamstrings")} strokeWidth="0.6" opacity="0.85"/>
      <path d="M188,150 Q194,158 194,170 Q194,180 190,184 Q184,188 179,183 Q176,174 177,162 Q178,152 184,149 Z" fill={c("hamstrings")} stroke={cs("hamstrings")} strokeWidth="0.6"/>
      <path d="M179,149 Q175,158 175,172 Q175,183 179,186 Q185,188 188,184 Q192,178 192,168 Q192,156 185,150 Z" fill={c("hamstrings")} stroke={cs("hamstrings")} strokeWidth="0.6" opacity="0.85"/>
      <ellipse cx="142" cy="187" rx="8" ry="6" fill="#1e1e1e" stroke="#3a3a3a" strokeWidth="0.5"/>
      <ellipse cx="184" cy="187" rx="8" ry="6" fill="#1e1e1e" stroke="#3a3a3a" strokeWidth="0.5"/>
      <path d="M135,193 Q130,203 131,214 Q132,221 137,223 Q142,224 145,219 Q147,210 146,200 Q144,192 139,191 Z" fill={c("calves")} stroke={cs("calves")} strokeWidth="0.6"/>
      <path d="M140,191 Q144,200 143,212 Q142,220 138,223 Q134,222 132,218 Q130,210 131,200 Z" fill={c("calves")} stroke={cs("calves")} strokeWidth="0.6" opacity="0.8"/>
      <path d="M191,193 Q196,203 195,214 Q194,221 189,223 Q184,224 181,219 Q179,210 180,200 Q182,192 187,191 Z" fill={c("calves")} stroke={cs("calves")} strokeWidth="0.6"/>
      <path d="M186,191 Q182,200 183,212 Q184,220 188,223 Q192,222 194,218 Q196,210 195,200 Z" fill={c("calves")} stroke={cs("calves")} strokeWidth="0.6" opacity="0.8"/>
      <ellipse cx="139" cy="225" rx="9" ry="4" fill="#1a1a1a" stroke="#333" strokeWidth="0.4"/>
      <ellipse cx="185" cy="225" rx="9" ry="4" fill="#1a1a1a" stroke="#333" strokeWidth="0.4"/>
      <text x="163" y="233" textAnchor="middle" style={{ fontSize:7, fill:"#555", fontFamily:"'DM Sans'", letterSpacing:2 }}>BACK</text>
    </svg>
  );
}

/* ── EXERCISE DETAIL PANEL ───────────────────────── */
function ExerciseDetailPanel({ exercise, onClose }) {
  const info = EXERCISE_INFO[exercise] || { primary:[], secondary:[], tips:[] };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, background:"rgba(0,0,0,0.6)" }} onClick={onClose}/>
      <div style={{ background:BLACK, maxHeight:"88vh", display:"flex", flexDirection:"column", animation:"slideUp 0.35s cubic-bezier(.22,1,.36,1)" }}>
        {/* Header */}
        <div style={{ background:"#111", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`2px solid ${RED}` }}>
          <div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:WHITE, letterSpacing:2 }}>{exercise}</div>
            <div style={{ fontSize:11, color:MUTED, marginTop:2 }}>
              {info.primary.length>0 && <>Primary: <span style={{ color:RED }}>{info.primary.map(m=>m.replace(/_/g," ")).join(", ")}</span></>}
              {info.secondary.length>0 && <> · Secondary: <span style={{ color:"#E8836B" }}>{info.secondary.map(m=>m.replace(/_/g," ")).join(", ")}</span></>}
            </div>
          </div>
          <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", fontSize:22, cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ overflowY:"auto", padding:"16px", flex:1 }}>
          {/* Muscle diagram */}
          <div style={{ background:"#111", padding:"12px", marginBottom:14, borderLeft:`3px solid ${RED}` }}>
            <MuscleBodyDiagram primary={info.primary} secondary={info.secondary}/>
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:10, height:10, background:RED }}/>
                <span style={{ fontSize:10, color:MUTED }}>Primary</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                <div style={{ width:10, height:10, background:"#E8836B" }}/>
                <span style={{ fontSize:10, color:MUTED }}>Secondary</span>
              </div>
            </div>
          </div>
          {/* Form tips */}
          {info.tips.length>0&&<>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid #333`, paddingBottom:5 }}>FORM TIPS</div>
            {info.tips.map((tip,i)=>(
              <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                <div style={{ width:20, height:20, background:RED, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue'", fontSize:12, color:WHITE }}>{i+1}</div>
                <div style={{ fontSize:13, color:WHITE, lineHeight:1.5, paddingTop:2 }}>{tip}</div>
              </div>
            ))}
          </>}
          {!info.tips.length&&<div style={{ fontSize:12, color:MUTED, textAlign:"center", padding:"20px 0" }}>Tap ⓘ on any exercise to see muscle targets and form cues.</div>}
        </div>
      </div>
    </div>
  );
}

function MainApp({ user, session, onSignOut, darkMode, onToggleDarkMode }) {
  const [tab,setTab]=useState("home");
  const [foodLog,setFoodLog]=useState(()=>lsGet('im_foodLog',[]));
  const [favorites,setFavorites]=useState(()=>lsGet('im_favorites',[]));
  const [sessions,setSessions]=useState(()=>lsGet('im_sessions',[]));
  const [bodyMetrics,setBodyMetrics]=useState(()=>lsGet('im_bodyMetrics',[]));
  const [sleepLog,setSleepLog]=useState(()=>lsGet('im_sleepLog',[]));
  const [customWorkouts,setCustomWorkouts]=useState(()=>lsGet('im_customWorkouts',[]));
  const [progressPhotos,setProgressPhotos]=useState(()=>lsGet('im_progressPhotos',[]));
  const [cardioLog,setCardioLog]=useState(()=>lsGet('im_cardioLog',[]));
  const [waterLog,setWaterLog]=useState(()=>{
    const saved=lsGet('im_waterLog',null);
    const today=new Date().toDateString();
    return (saved&&saved.date===today) ? saved : { cups:0, date:today, target:8 };
  });
  const [mealPlan,setMealPlan]=useState(null);
  const [generatingPlan,setGeneratingPlan]=useState(false);
  const [healthSub,setHealthSub]=useState("metrics");
  const [profiles,setProfiles]=useState(()=>{
    const saved=lsGet('oja_profiles',null);
    if(saved&&saved.length) return saved;
    const base=lsGet('oja_goals',DEFAULT_GOALS);
    return [{ id:1, name:"My Targets", ...base, isActive:true }];
  });
  const activeGoals = profiles.find(p=>p.isActive)||profiles[0]||DEFAULT_GOALS;
  const [showSettings,setShowSettings]=useState(false);
  const [rankNotif,setRankNotif]=useState(null);
  const [prevScore,setPrevScore]=useState(()=>lsGet('im_prevScore',0));
  const [activeSession,setActiveSession]=useState(()=>lsGet('im_activeSession',null));
  const [saveWorkoutName,setSaveWorkoutName]=useState("");
  const [showSaveWorkout,setShowSaveWorkout]=useState(false);
  const [pendingSaveExercises,setPendingSaveExercises]=useState([]);
  const [newCardio,setNewCardio]=useState({ type:"Run", duration:"", distance:"", effort:3, caloriesBurned:"", caloriesEstimated:null, estimatingCals:false });
  const [showCardioForm,setShowCardioForm]=useState(false);
  const [editingFood,setEditingFood]=useState(null);
  const [showExercisePicker,setShowExercisePicker]=useState(false);
  const [exerciseSearch,setExerciseSearch]=useState("");
  const [exerciseDetail,setExerciseDetail]=useState(null);
  const [workoutSeconds,setWorkoutSeconds]=useState(0);
  const [timerRunning,setTimerRunning]=useState(false);
  const [restTimer,setRestTimer]=useState(null);
  const [restDuration,setRestDuration]=useState(90);
  const [logDate,setLogDate]=useState(()=>new Date().toDateString()); // food log history
  const [expandedSession,setExpandedSession]=useState(null); // workout history detail
  const [volumeExercise,setVolumeExercise]=useState(null); // exercise to show volume chart for
  const [notifEnabled,setNotifEnabled]=useState(()=>lsGet('im_notifEnabled',false));
  const [bodyMeasurements,setBodyMeasurements]=useState(()=>lsGet('im_bodyMeasurements',[]));
  const [newMeasurement,setNewMeasurement]=useState({ chest:"", waist:"", hips:"", arms:"", thighs:"" });
  const [newWeight,setNewWeight]=useState("");
  const [newSleep,setNewSleep]=useState({ hours:"", quality:3, soreness:3 });
  const [planPrefs,setPlanPrefs]=useState({ restrictions:"", dietType:"None" });
  const [showAddFood,setShowAddFood]=useState(false);
  const progressPhotoRef=useRef();

  const today=new Date().toLocaleDateString("en-US",{ weekday:"short", month:"short", day:"numeric" });
  const totals=foodLog.reduce((a,f)=>({ calories:a.calories+(f.calories||0), protein:a.protein+(f.protein||0), carbs:a.carbs+(f.carbs||0), fat:a.fat+(f.fat||0) }),{ calories:0, protein:0, carbs:0, fat:0 });
  const activityScore=foodLog.length+sessions.length+bodyMetrics.length+sleepLog.length+cardioLog.length;
  const rank=getRank(activityScore);
  const nextRank=RANKS[RANKS.indexOf(RANKS.find(r=>r.min===rank.min))+1];
  const rankProgress=nextRank?Math.min((activityScore-rank.min)/(nextRank.min-rank.min)*100,100):100;
  const latestSleep=sleepLog[sleepLog.length-1];
  const recoveryScore=latestSleep?Math.round(Math.min(parseFloat(latestSleep.hours)/8,1)*50+((6-latestSleep.soreness)/5)*30+(latestSleep.quality/5)*20):null;

  // all unique foods ever logged (for recent searches)
  const recentFoods = [...new Map(
    [...foodLog].reverse().map(f => [f.name, f])
  ).values()];

  // Persist profiles
  useEffect(()=>lsSet('oja_profiles', profiles),[profiles]);
  useEffect(()=>lsSet('oja_goals', activeGoals),[activeGoals]);
  // Persist all logs
  useEffect(()=>lsSet('im_foodLog', foodLog),[foodLog]);
  useEffect(()=>lsSet('im_favorites', favorites),[favorites]);
  useEffect(()=>lsSet('im_sessions', sessions),[sessions]);
  useEffect(()=>lsSet('im_bodyMetrics', bodyMetrics),[bodyMetrics]);
  useEffect(()=>lsSet('im_sleepLog', sleepLog),[sleepLog]);
  useEffect(()=>lsSet('im_customWorkouts', customWorkouts),[customWorkouts]);
  useEffect(()=>lsSet('im_progressPhotos', progressPhotos),[progressPhotos]);
  useEffect(()=>lsSet('im_cardioLog', cardioLog),[cardioLog]);
  useEffect(()=>{ if(activeSession) lsSet('im_activeSession',activeSession); else { try { localStorage.removeItem('im_activeSession'); } catch {} } },[activeSession]);
  useEffect(()=>lsSet('im_bodyMeasurements', bodyMeasurements),[bodyMeasurements]);
  useEffect(()=>lsSet('im_notifEnabled', notifEnabled),[notifEnabled]);

  // Personal records — find max weight per exercise across all sessions
  const personalRecords = (() => {
    const prs = {};
    sessions.forEach(s => {
      s.exercises?.forEach(ex => {
        ex.sets?.forEach(set => {
          const w = parseFloat(set.weight);
          if (!isNaN(w) && w > 0) {
            if (!prs[ex.name] || w > prs[ex.name]) prs[ex.name] = w;
          }
        });
      });
    });
    return prs;
  })();

  // Check if latest session has any new PRs
  const latestSessionPRs = (() => {
    if (!sessions.length) return [];
    const latest = sessions[sessions.length-1];
    const prs = [];
    latest.exercises?.forEach(ex => {
      ex.sets?.forEach(set => {
        const w = parseFloat(set.weight);
        if (!isNaN(w) && w > 0 && personalRecords[ex.name] === w) {
          if (!prs.find(p=>p.name===ex.name)) prs.push({ name:ex.name, weight:w });
        }
      });
    });
    return prs;
  })();
  useEffect(()=>lsSet('im_waterLog', waterLog),[waterLog]);
  useEffect(()=>lsSet('im_prevScore', prevScore),[prevScore]);

  // ── CLOUD SYNC ── push all state to Supabase whenever anything changes
  useEffect(() => {
    if (!session?.access_token) return;
    const userId = parseJwt(session.access_token)?.sub;
    if (!userId) return;
    const payload = {
      user_profile:    user,
      food_log:        foodLog,
      favorites,
      sessions,
      body_metrics:    bodyMetrics,
      sleep_log:       sleepLog,
      cardio_log:      cardioLog,
      custom_workouts: customWorkouts,
      profiles,
    };
    const timer = setTimeout(() => {
      sbUpsertData(session.access_token, userId, payload);
    }, 2000); // debounce — wait 2s after last change before syncing
    return () => clearTimeout(timer);
  }, [foodLog, favorites, sessions, bodyMetrics, sleepLog, cardioLog, customWorkouts, profiles]);

  // Rank up detection
  useEffect(()=>{
    const newRank=getRank(activityScore);
    const oldRank=getRank(prevScore);
    if(activityScore>prevScore && newRank.min>oldRank.min){
      setRankNotif(newRank);
    }
    setPrevScore(activityScore);
  },[activityScore]);

  // Workout timer — only counts when timerRunning is true
  useEffect(()=>{
    if(!activeSession || !timerRunning) return;
    const interval = setInterval(()=>setWorkoutSeconds(s=>s+1), 1000);
    return ()=>clearInterval(interval);
  },[activeSession?.id, timerRunning]);

  // Rest timer — counts down
  useEffect(()=>{
    if(!restTimer) return;
    if(restTimer.seconds<=0){
      playZenBowl();
      try { navigator.vibrate?.([200,100,200]); } catch {}
      setRestTimer(null);
      return;
    }
    const t = setTimeout(()=>setRestTimer(r=>r?{...r,seconds:r.seconds-1}:null),1000);
    return ()=>clearTimeout(t);
  },[restTimer?.seconds]);

  // Reset water daily
  useEffect(()=>{
    const today=new Date().toDateString();
    if(waterLog.date!==today) setWaterLog({ cups:0, date:today, target:8 });
  },[]);

  // Weekly summary
  const weeklyStats = (() => {
    const weekAgo=Date.now()-7*24*60*60*1000;
    const wFoods=foodLog.filter(f=>f.id>=weekAgo);
    const wSessions=sessions.filter(s=>s.id>=weekAgo);
    const wSleep=sleepLog.filter(s=>s.id>=weekAgo);
    const wMetrics=bodyMetrics.filter(m=>m.id>=weekAgo);
    const days=new Set(wFoods.map(f=>new Date(f.id).toDateString())).size||1;
    const avgCals=wFoods.length?Math.round(wFoods.reduce((a,f)=>a+(f.calories||0),0)/days):0;
    const avgSleep=wSleep.length?(wSleep.reduce((a,s)=>a+parseFloat(s.hours||0),0)/wSleep.length).toFixed(1):null;
    const weightChange=wMetrics.length>=2?(parseFloat(wMetrics[wMetrics.length-1].weight)-parseFloat(wMetrics[0].weight)).toFixed(1):null;
    return { avgCals, workouts:wSessions.length, avgSleep, weightChange };
  })();

  // Streak calculation — consecutive days with at least 1 food logged
  const streak = (() => {
    if (!foodLog.length) return 0;
    const logged = new Set(foodLog.map(f => {
      const d = new Date(f.id); // id is Date.now()
      return `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;
    }));
    let count = 0, d = new Date();
    while (true) {
      const key = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;
      if (logged.has(key)) { count++; d.setDate(d.getDate()-1); }
      else break;
    }
    return count;
  })();

  const addFoodItem = (item) => { setFoodLog(p=>[...p, item]); };
  const deleteFoodItem = (id) => { setFoodLog(p=>p.filter(f=>f.id!==id)); };
  const editFoodItem = (id, changes) => { setFoodLog(p=>p.map(f=>f.id===id?{...f,...changes}:f)); };

  const enableNotifications = async () => {
    if (!("Notification" in window)) return alert("Notifications not supported on this device.");
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotifEnabled(true);
      new Notification("Izana Mode", { body:"Notifications enabled! We'll remind you to log your meals and workouts.", icon:"/icon-192.png" });
    } else {
      setNotifEnabled(false);
      alert("Notification permission denied. Enable in your browser settings.");
    }
  };

  const addMeasurement = () => {
    const hasAny = Object.values(newMeasurement).some(v=>v.trim()!=="");
    if (!hasAny) return;
    setBodyMeasurements(p=>[...p, { ...newMeasurement, id:Date.now(), date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}) }]);
    setNewMeasurement({ chest:"", waist:"", hips:"", arms:"", thighs:"" });
  };

  const addCardio = () => {
    if (!newCardio.duration || isNaN(parseFloat(newCardio.duration))) return;
    setCardioLog(p=>[...p, {
      ...newCardio,
      id:Date.now(),
      date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
    }]);
    setNewCardio({ type:"Run", duration:"", distance:"", effort:3, caloriesBurned:"", caloriesEstimated:null, estimatingCals:false });
    setShowCardioForm(false);
  };

  const estimateCardioCalories = async () => {
    if (!newCardio.duration || isNaN(parseFloat(newCardio.duration))) return;
    setNewCardio(c=>({...c, estimatingCals:true}));
    const latestWeight = bodyMetrics.length ? bodyMetrics[bodyMetrics.length-1].weight : null;
    try {
      const res = await fetch("/api/claude", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:200,
          messages:[{ role:"user", content:`Estimate calories burned for this cardio session. Activity: ${newCardio.type}. Duration: ${newCardio.duration} minutes. ${newCardio.distance?`Distance: ${newCardio.distance} miles.`:""} Effort level: ${newCardio.effort}/5. ${latestWeight?`User weight: ${latestWeight} lbs.`:""} Respond ONLY with a single JSON object (no markdown): {"calories":number,"note":"one brief sentence explaining the estimate"}` }]
        })
      });
      const data = await res.json();
      const txt = data.content?.find(b=>b.type==="text")?.text||"";
      const parsed = JSON.parse(txt.replace(/```json|```/g,"").trim());
      setNewCardio(c=>({...c, caloriesEstimated:parsed, caloriesBurned:String(parsed.calories), estimatingCals:false}));
    } catch {
      setNewCardio(c=>({...c, estimatingCals:false}));
    }
  };

  const handleReset = () => {
    const keys = ['im_foodLog','im_favorites','im_sessions','im_bodyMetrics','im_sleepLog',
                  'im_customWorkouts','im_progressPhotos','im_waterLog','im_prevScore',
                  'im_user','oja_goals','oja_profiles','im_cardioLog','im_activeSession'];
    keys.forEach(k=>{ try { localStorage.removeItem(k); } catch {} });
    window.location.reload();
  };

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user,
      goals: activeGoals,
      profiles,
      foodLog,
      favorites,
      sessions,
      bodyMetrics,
      sleepLog,
      waterLog,
      customWorkouts,
      progressPhotos: progressPhotos.map(p=>({ ...p, base64:"[image data omitted for size]" })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `izana-mode-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const addWater = () => setWaterLog(w=>({...w, cups:Math.min(w.cups+1, 20)}));
  const removeWater = () => setWaterLog(w=>({...w, cups:Math.max(0, w.cups-1)}));
  const saveCurrentWorkout = (name) => {
    if(!name.trim()) return;
    const exercises = activeSession
      ? activeSession.exercises.map(e=>e.name)
      : pendingSaveExercises;
    if(!exercises.length) return;
    const workout={ id:Date.now(), name:name.trim(), exercises };
    setCustomWorkouts(p=>[...p.filter(w=>w.name!==name.trim()), workout]);
    setPendingSaveExercises([]);
  };
  const addProgressPhoto = (base64) => {
    const entry={ id:Date.now(), date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}), base64, weight:bodyMetrics[bodyMetrics.length-1]?.weight||"" };
    setProgressPhotos(p=>[...p, entry]);
  };

  const toggleFavorite = (food) => {
    const isFav = favorites.find(f=>f.name===food.name);
    if (isFav) setFavorites(f=>f.filter(x=>x.name!==food.name));
    else setFavorites(f=>[...f, { name:food.name, calories:food.calories, protein:food.protein, carbs:food.carbs, fat:food.fat, fiber:food.fiber||0, sugar:food.sugar||0, serving:food.serving, confidence:food.confidence, notes:food.notes }]);
  };

  const generateMealPlan=async()=>{
    setGeneratingPlan(true); setMealPlan(null);
    try {
      const res=await fetch("/api/claude",{ method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1500,
          messages:[{ role:"user", content:`Create a 7-day meal plan. Goal: ${user.goal}. Daily calories: ${activeGoals.calories}. Diet: ${planPrefs.dietType==="None"?"Standard / no restrictions":planPrefs.dietType==="Custom"?planPrefs.restrictions:planPrefs.dietType}.
Respond ONLY with valid JSON (no markdown): {"days":[{"day":"Monday","meals":[{"name":"meal name","calories":number,"protein":number,"carbs":number,"fat":number,"time":"Breakfast"}]}]}
Include Breakfast, Lunch, Dinner, Snack for each day.` }]
        })
      });
      const data=await res.json();
      const txt=data.content?.find(b=>b.type==="text")?.text||"";
      setMealPlan(JSON.parse(txt.replace(/```json|```/g,"").trim()));
    } catch { alert("Couldn't generate plan. Try again."); }
    setGeneratingPlan(false);
  };

  const addMetric=()=>{
    if(!newWeight||isNaN(parseFloat(newWeight))) return;
    setBodyMetrics(p=>[...p,{ weight:newWeight, date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}), id:Date.now() }]);
    setNewWeight("");
  };
  const addSleep=()=>{
    if(!newSleep.hours||isNaN(parseFloat(newSleep.hours))) return;
    setSleepLog(p=>[...p,{ ...newSleep, date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}), id:Date.now() }]);
    setNewSleep({ hours:"", quality:3, soreness:3 });
  };

  const startWorkout=(t, loadExercises=false)=>{
    setShowExercisePicker(false); setExerciseSearch(""); setTab("workout");
    setWorkoutSeconds(0); setTimerRunning(false); setRestTimer(null);

    // Build a map of last used reps/weight per exercise from session history
    const lastUsed = {};
    [...sessions].reverse().forEach(s => {
      s.exercises?.forEach(ex => {
        if (!lastUsed[ex.name]) {
          const lastSet = [...(ex.sets||[])].reverse().find(st=>st.reps||st.weight);
          if (lastSet) lastUsed[ex.name] = { reps: lastSet.reps||"", weight: lastSet.weight||"" };
        }
      });
    });

    const makeExercise = (name) => ({
      name,
      sets: [{ reps: lastUsed[name]?.reps||"", weight: lastUsed[name]?.weight||"", done:false }]
    });

    setActiveSession({
      id:Date.now(), name:t.name,
      start:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
      exercises: loadExercises ? t.exercises.map(makeExercise) : [],
      template: t.exercises||[]
    });
  };
  const addExerciseToSession = (name) => {
    const lastUsed = {};
    [...sessions].reverse().forEach(s => {
      s.exercises?.forEach(ex => {
        if (!lastUsed[ex.name]) {
          const lastSet = [...(ex.sets||[])].reverse().find(st=>st.reps||st.weight);
          if (lastSet) lastUsed[ex.name] = { reps:lastSet.reps||"", weight:lastSet.weight||"" };
        }
      });
    });
    setActiveSession(s=>({ ...s, exercises:[...s.exercises,{ name, sets:[{ reps:lastUsed[name]?.reps||"", weight:lastUsed[name]?.weight||"", done:false }] }] }));
  };
  const addSet=(ei)=>setActiveSession(s=>({ ...s, exercises:s.exercises.map((ex,i)=>i===ei?{ ...ex, sets:[...ex.sets,{reps:"",weight:"",done:false}] }:ex) }));
  const updateSet=(ei,si,f,v)=>{
    setActiveSession(s=>({ ...s, exercises:s.exercises.map((ex,i)=>i!==ei?ex:{ ...ex, sets:ex.sets.map((st,j)=>j!==si?st:{ ...st,[f]:v }) }) }));
  };
  const toggleSetDone=(ei,si)=>{
    setActiveSession(s=>({
      ...s,
      exercises:s.exercises.map((ex,i)=>i!==ei?ex:{ ...ex, sets:ex.sets.map((st,j)=>j!==si?st:{ ...st, done:!st.done }) })
    }));
  };
  const playZenBowl = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const gain2 = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc2.frequency.setValueAtTime(1056, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
      osc.type = "sine"; osc2.type = "sine";
      osc.start(); osc2.start();
      osc.stop(ctx.currentTime + 3); osc2.stop(ctx.currentTime + 2);
    } catch {}
  };
  const finishWorkout=()=>{
    const exerciseNames = activeSession.exercises.map(e=>e.name);
    setSessions(p=>[...p,{ ...activeSession, end:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), date:today, duration:workoutSeconds }]);
    // Auto-prompt to save My Build sessions — capture exercises BEFORE clearing session
    if(activeSession.name==="型 — My Build" && exerciseNames.length>0) {
      setPendingSaveExercises(exerciseNames);
      setShowSaveWorkout(true);
    }
    setActiveSession(null); setRestTimer(null); setWorkoutSeconds(0); setTimerRunning(false);
  };

  const goalLabel={ cut:"削 Cut", bulk:"増 Bulk", recomp:"変 Recomp", endure:"耐 Endure" };

  const S={
    app:       { fontFamily:"'DM Sans', sans-serif", background:BG, minHeight:"100vh", maxWidth:420, margin:"0 auto", display:"flex", flexDirection:"column", color:TEXT },
    header:    { background:BLACK, borderBottom:`3px solid ${RED}` },
    headerTop: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px 12px" },
    logo:      { fontFamily:"'Bebas Neue'", fontSize:28, color:WHITE, letterSpacing:3, lineHeight:1 },
    subhead:   { fontSize:9, color:"#555", letterSpacing:2, textTransform:"uppercase", marginTop:2 },
    content:   { flex:1, overflowY:"auto", padding:"14px 14px 80px" },
    card:      { background:CARD, border:`1px solid ${BORDER}`, borderRadius:0, padding:"14px", marginBottom:10, borderLeft:`3px solid ${RED}` },
    cardBlack: { background:BLACK, border:`1px solid #333`, borderRadius:0, padding:"14px", marginBottom:10, borderLeft:`3px solid ${RED}` },
    card2:     { background:CARD2, border:`1px solid ${BORDER}`, borderRadius:0, padding:"10px", marginBottom:8 },
    label:     { fontFamily:"'Bebas Neue'", fontSize:12, color:MUTED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid ${BORDER}`, paddingBottom:5 },
    labelRed:  { fontFamily:"'Bebas Neue'", fontSize:12, color:RED, letterSpacing:2, marginBottom:10, borderBottom:`1px solid ${RED}55`, paddingBottom:5 },
    bigNum:    { fontFamily:"'Bebas Neue'", fontSize:40, color:TEXT, lineHeight:1 },
    btn:       { background:RED, color:WHITE, border:"none", borderRadius:0, padding:"13px 20px", fontSize:14, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnBlack:  { background:BLACK, color:WHITE, border:`1.5px solid ${BLACK}`, borderRadius:0, padding:"11px 20px", fontSize:13, fontWeight:600, fontFamily:"'DM Sans'", cursor:"pointer", width:"100%", letterSpacing:1, textTransform:"uppercase" },
    btnSm:     { background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, borderRadius:0, padding:"6px 10px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer" },
    btnSmRed:  { background:"transparent", color:RED, border:`1px solid ${RED}`, borderRadius:0, padding:"6px 12px", fontSize:12, fontFamily:"'DM Sans'", cursor:"pointer", letterSpacing:1 },
    input:     { background:"#F5F4F2", color:"#111111", border:`1px solid ${BORDER}`, borderRadius:0, padding:"9px 10px", fontSize:13, fontFamily:"'DM Sans'", width:"100%", boxSizing:"border-box", outline:"none", borderBottom:`2px solid ${RED}` },
    tab:    (a)=>({ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"9px 0 5px", cursor:"pointer", gap:2, background:a?BLACK:"transparent", border:"none", borderTopWidth:2, borderTopColor:a?RED:"transparent", borderTopStyle:"solid" }),
    tabLabel:  (a)=>({ fontSize:9, fontFamily:"'Bebas Neue'", color:a?RED:MUTED, letterSpacing:1.2 }),
    nav:       { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:420, background:CARD, borderTop:`2px solid ${BLACK}`, display:"flex", zIndex:100, paddingBottom:4 },
    pill:   (c)=>({ background:c+"18", color:c, border:`1px solid ${c}55`, borderRadius:2, padding:"2px 7px", fontSize:10, fontWeight:600, display:"inline-block", letterSpacing:0.5 }),
    macroChip: (c)=>({ background:c+"12", color:c, borderRadius:0, padding:"8px 6px", textAlign:"center", flex:1, borderBottom:`2px solid ${c}` }),
    setRow:    { display:"flex", gap:8, alignItems:"center", marginBottom:6 },
    subTab: (a)=>({ flex:1, padding:"9px 6px", textAlign:"center", fontFamily:"'Bebas Neue'", fontSize:12, letterSpacing:1.5, color:a?RED:MUTED, background:a?CARD:CARD2, border:"none", borderBottom:`2px solid ${a?RED:"transparent"}`, cursor:"pointer" }),
  };

  const TabIcon=({ name, active })=>{
    const c=active?RED:MUTED;
    const icons={
      home:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={c} strokeWidth="1.8" fill={active?c+"22":"none"}/><path d="M9 21V12h6v9" stroke={c} strokeWidth="1.8"/></svg>,
      log:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke={c} strokeWidth="1.8"/><path d="M9 12h6M9 16h4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
      workout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4v16M18 4v16M6 12h12M2 6h4M18 6h4M2 18h4M18 18h4" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
      health:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={c} strokeWidth="1.8" fill={active?c+"22":"none"}/></svg>,
    };
    return icons[name];
  };

  const openLogFood = () => { setTab("log"); setShowAddFood(true); };

  return (
    <div style={S.app}>
      {showAddFood && <AddFoodPanel onAdd={addFoodItem} onClose={()=>setShowAddFood(false)} favorites={favorites} recentFoods={recentFoods}/>}
      {showSettings && <SettingsPanel user={user} session={session} profiles={profiles} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} onSaveProfiles={(p)=>{ setProfiles(p); setShowSettings(false); }} onReset={handleReset} onExport={handleExport} onSignOut={onSignOut} onClose={()=>setShowSettings(false)}/>}
      {rankNotif && <RankUpCelebration rank={rankNotif} onDone={()=>setRankNotif(null)}/>}
      {exerciseDetail && <ExerciseDetailPanel exercise={exerciseDetail} onClose={()=>setExerciseDetail(null)}/>}

      <div style={S.header}>
        <div style={S.headerTop}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <YinYang size={36} style={{ mixBlendMode:"multiply" }}/>
            <div>
              <div style={S.logo}>IZANA <span style={{ color:RED }}>MODE</span></div>
              <div style={S.subhead}>{user.name.toUpperCase()} · {goalLabel[user.goal]} · {today}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:rank.color, letterSpacing:2 }}>{rank.title}</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:RED, lineHeight:1 }}>{Math.round(totals.calories)}</div>
              <div style={{ fontSize:9, color:"#555", letterSpacing:1, textTransform:"uppercase" }}>kcal today</div>
            </div>
            <button onClick={()=>setShowSettings(true)} style={{ background:"transparent", border:`1px solid #333`, color:"#555", width:34, height:34, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#888" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#888" strokeWidth="1.8"/></svg>
            </button>
          </div>
        </div>
        <div style={{ height:3, background:`linear-gradient(90deg,${RED},${BLACK})` }}/>
      </div>

      <div style={S.content}>

        {/* ── OFFLINE INDICATOR ── */}
        {!navigator.onLine && (
          <div style={{ background:"#1a1000", border:`1px solid #554400`, color:"#ffcc00", fontSize:12, padding:"8px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:8 }}>
            <span>📡</span> No internet connection — cloud sync paused. Data is saved locally.
          </div>
        )}

        {/* ── ACTIVE SESSION RESUME BANNER ── */}
        {activeSession && tab!=="workout" && (
          <div onClick={()=>setTab("workout")} style={{ background:BLACK, border:`2px solid ${RED}`, padding:"12px 14px", marginBottom:10, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:2, marginBottom:2 }}>SESSION IN PROGRESS</div>
              <div style={{ fontSize:12, color:WHITE }}>{activeSession.name} · {activeSession.exercises.length} exercise{activeSession.exercises.length!==1?"s":""} · Started {activeSession.start}</div>
            </div>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED }}>›</div>
          </div>
        )}

        {/* ── HOME ── */}
        {tab==="home"&&(<>
          <div style={{ ...S.cardBlack, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:56, height:56, background:rank.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:WHITE }}>{rank.kanji}</span>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:"#555", letterSpacing:3, marginBottom:2 }}>TENJIKU RANK</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:WHITE, letterSpacing:1, lineHeight:1 }}>{rank.sub} <span style={{ fontSize:12, color:"#555" }}>· {rank.title}</span></div>
              <div style={{ marginTop:8, height:3, background:"#222", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${rankProgress}%`, background:rank.color, transition:"width 0.5s" }}/>
              </div>
              <div style={{ fontFamily:"'DM Sans'", fontSize:10, color:"#555", marginTop:3 }}>
                {nextRank?`${activityScore-rank.min} / ${nextRank.min-rank.min} to ${nextRank.title}`:"Maximum rank achieved"}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            {/* Streak card */}
            <div style={{ ...S.card, flex:1, marginBottom:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:streak>0?RED:MUTED, lineHeight:1 }}>{streak}</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:10, color:MUTED, letterSpacing:2, marginTop:2 }}>DAY{streak!==1?"S":""} STREAK</div>
              <div style={{ fontSize:10, color:streak>=7?RED:MUTED, marginTop:4 }}>{streak===0?"Log today to start":streak>=7?"🔥 On fire!":streak>=3?"Keep going!":"Keep it up!"}</div>
            </div>
            {/* Activity score card */}
            <div style={{ ...S.card, flex:1, marginBottom:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"12px 8px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:36, color:TEXT, lineHeight:1 }}>{activityScore}</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:10, color:MUTED, letterSpacing:2, marginTop:2 }}>TOTAL LOGS</div>
              <div style={{ fontSize:10, color:MUTED, marginTop:4 }}>{foodLog.length}f · {sessions.length}w · {sleepLog.length}s</div>
            </div>
          </div>

          {/* ── PROFILE SWITCHER ── */}
          {profiles.length>0&&<div style={{ ...S.card, padding:"10px 14px", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button onClick={()=>{ const i=profiles.findIndex(p=>p.isActive); const prev=(i-1+profiles.length)%profiles.length; setProfiles(ps=>ps.map((p,idx)=>({...p,isActive:idx===prev}))); }}
                style={{ background:"transparent", border:`1px solid ${BORDER}`, color:MUTED, width:32, height:32, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
              <div style={{ textAlign:"center", flex:1 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:10, color:MUTED, letterSpacing:2 }}>TODAY'S TARGETS</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:TEXT, letterSpacing:1 }}>{activeGoals.name||"My Targets"}</div>
                <div style={{ fontSize:10, color:MUTED }}>{activeGoals.calories} kcal · P:{activeGoals.protein}g · C:{activeGoals.carbs}g · F:{activeGoals.fat}g</div>
              </div>
              <button onClick={()=>{ const i=profiles.findIndex(p=>p.isActive); const next=(i+1)%profiles.length; setProfiles(ps=>ps.map((p,idx)=>({...p,isActive:idx===next}))); }}
                style={{ background:"transparent", border:`1px solid ${BORDER}`, color:MUTED, width:32, height:32, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
            </div>
          </div>}

          <div style={S.card}>
            <div style={S.labelRed}>Daily Calories</div>
            <div style={{ display:"flex", alignItems:"center", gap:20 }}>
              <Ring value={totals.calories} max={activeGoals.calories} size={86} stroke={9} color={RED}/>
              <div style={{ flex:1 }}>
                <div style={S.bigNum}>{Math.round(Math.max(0, activeGoals.calories-totals.calories))}</div>
                <div style={{ fontSize:12, color:MUTED }}>kcal remaining</div>
                {recoveryScore!==null&&<div style={{ marginTop:6, display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:8, height:8, background:recoveryScore>70?RED:MUTED }}/>
                  <span style={{ fontSize:11, color:MUTED }}>Recovery: <span style={{ color:TEXT, fontWeight:600 }}>{recoveryScore}/100</span></span>
                </div>}
              </div>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.label}>Macros</div>
            <MacroBar label="Protein" val={totals.protein} max={activeGoals.protein} color={RED}/>
            <MacroBar label="Carbs"   val={totals.carbs}   max={activeGoals.carbs}   color={BLACK}/>
            <MacroBar label="Fat"     val={totals.fat}      max={activeGoals.fat}     color={MUTED}/>
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <button style={{ ...S.btn, flex:1 }} onClick={openLogFood}>🍱 Log Food</button>
            <button style={{ ...S.btnBlack, flex:1 }} onClick={()=>setTab("workout")}>🏋️ Workout</button>
          </div>

          {/* ── WATER TRACKER ── */}
          <div style={S.card}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <div style={S.labelRed} >💧 Water Today</div>
              <span style={{ fontSize:11, color:MUTED }}>{waterLog.cups}/{waterLog.target} cups</span>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
              {Array.from({length:waterLog.target}).map((_,i)=>(
                <div key={i} style={{ width:28, height:28, background:i<waterLog.cups?RED+"22":"transparent", border:`1.5px solid ${i<waterLog.cups?RED:BORDER}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>
                  {i<waterLog.cups?"💧":"○"}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={addWater} style={{ flex:1, background:RED, color:WHITE, border:"none", padding:"10px", fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:1, cursor:"pointer" }}>+ Cup</button>
              <button onClick={removeWater} style={{ background:CARD2, color:TEXT, border:`1px solid ${BORDER}`, padding:"10px 16px", fontFamily:"'Bebas Neue'", fontSize:14, cursor:"pointer" }}>−</button>
              <button onClick={()=>setWaterLog(w=>({...w,target:Math.min(16,w.target+1)}))} style={{ background:CARD2, color:MUTED, border:`1px solid ${BORDER}`, padding:"10px 12px", fontSize:11, fontFamily:"'DM Sans'", cursor:"pointer" }}>Goal+</button>
            </div>
          </div>

          {/* ── WEEKLY SUMMARY ── */}
          {(weeklyStats.avgCals>0||weeklyStats.workouts>0) && <div style={S.card}>
            <div style={S.label}>This Week</div>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ flex:1, textAlign:"center", background:CARD2, padding:"10px 6px" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:26, color:RED }}>{weeklyStats.avgCals||"—"}</div>
                <div style={{ fontSize:9, color:MUTED, letterSpacing:1 }}>AVG KCAL</div>
              </div>
              <div style={{ flex:1, textAlign:"center", background:CARD2, padding:"10px 6px" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:26, color:TEXT }}>{weeklyStats.workouts}</div>
                <div style={{ fontSize:9, color:MUTED, letterSpacing:1 }}>WORKOUTS</div>
              </div>
              <div style={{ flex:1, textAlign:"center", background:CARD2, padding:"10px 6px" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:26, color:TEXT }}>{weeklyStats.avgSleep||"—"}</div>
                <div style={{ fontSize:9, color:MUTED, letterSpacing:1 }}>AVG SLEEP</div>
              </div>
              <div style={{ flex:1, textAlign:"center", background:CARD2, padding:"10px 6px" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:26, color:weeklyStats.weightChange<0?RED:TEXT }}>{weeklyStats.weightChange!==null?(weeklyStats.weightChange>0?"+":"")+weeklyStats.weightChange:"—"}</div>
                <div style={{ fontSize:9, color:MUTED, letterSpacing:1 }}>LBS CHANGE</div>
              </div>
            </div>
          </div>}

          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <button style={{ ...S.btnSm, flex:1, padding:"9px 4px", textAlign:"center", fontSize:11, letterSpacing:0.5 }} onClick={()=>{ setTab("health"); setHealthSub("sleep"); }}>😴 Log Sleep</button>
            <button style={{ ...S.btnSm, flex:1, padding:"9px 4px", textAlign:"center", fontSize:11, letterSpacing:0.5 }} onClick={()=>{ setTab("health"); setHealthSub("metrics"); }}>⚖️ Log Weight</button>
            <button style={{ ...S.btnSm, flex:1, padding:"9px 4px", textAlign:"center", fontSize:11, letterSpacing:0.5 }} onClick={()=>{ setTab("health"); setHealthSub("ai"); }}>🤖 Meal Plan</button>
          </div>

          {foodLog.length>0&&<div style={S.card}>
            <div style={S.label}>Today's Food</div>
            {foodLog.slice(-4).reverse().map(f=>(
              <div key={f.id} style={{ ...S.card2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{f.name}</div>
                  <div style={{ fontSize:11, color:MUTED }}>{f.mealType||f.time} · {f.time}</div>
                </div>
                <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED }}>{Math.round(f.calories)} kcal</span>
              </div>
            ))}
          </div>}

          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"20px 0 10px", gap:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:6, color:BLACK, opacity:0.22 }}>初代</span>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:6, color:BLACK, opacity:0.22 }}>横浜</span>
            </div>
            <YinYang size={190} style={{ opacity:0.82, mixBlendMode:"darken" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:6, color:BLACK, opacity:0.22 }}>天</span>
              <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, letterSpacing:6, color:BLACK, opacity:0.22 }}>竺</span>
            </div>
          </div>
        </>)}

        {/* ── LOG ── */}
        {tab==="log"&&(<>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, letterSpacing:2 }}>Food Log</div>
            <button style={S.btnSmRed} onClick={()=>setShowAddFood(true)}>+ Log Food</button>
          </div>

          {/* Date navigator */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <button onClick={()=>{ const d=new Date(logDate); d.setDate(d.getDate()-1); setLogDate(d.toDateString()); }}
              style={{ background:CARD2, border:`1px solid ${BORDER}`, color:TEXT, width:32, height:32, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
            <div style={{ flex:1, textAlign:"center", fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:1 }}>
              {logDate===new Date().toDateString()?"Today":new Date(logDate).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
            </div>
            <button onClick={()=>{ const d=new Date(logDate); d.setDate(d.getDate()+1); if(d<=new Date()) setLogDate(d.toDateString()); }}
              style={{ background:CARD2, border:`1px solid ${BORDER}`, color:new Date(logDate).toDateString()===new Date().toDateString()?BORDER:TEXT, width:32, height:32, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
          </div>

          <div style={S.card}>
            <div style={S.labelRed}>
              {logDate===new Date().toDateString()?"Today's Totals":"Day Totals"}
            </div>
            {(() => {
              const dayLog = foodLog.filter(f => new Date(f.id).toDateString()===logDate);
              const dayTotals = dayLog.reduce((a,f)=>({ calories:a.calories+(f.calories||0), protein:a.protein+(f.protein||0), carbs:a.carbs+(f.carbs||0), fat:a.fat+(f.fat||0) }),{ calories:0, protein:0, carbs:0, fat:0 });
              return (
                <div style={{ display:"flex", gap:8, justifyContent:"space-around" }}>
                  <Ring value={dayTotals.calories} max={activeGoals.calories} size={66} stroke={6} color={RED}     label="Kcal"/>
                  <Ring value={dayTotals.protein}  max={activeGoals.protein}  size={66} stroke={6} color={BLACK}   label="Protein"/>
                  <Ring value={dayTotals.carbs}    max={activeGoals.carbs}    size={66} stroke={6} color={MUTED}   label="Carbs"/>
                  <Ring value={dayTotals.fat}      max={activeGoals.fat}      size={66} stroke={6} color={RED_DIM} label="Fat"/>
                </div>
              );
            })()}
          </div>

          {/* Favorites quick-access */}
          {favorites.length>0&&<div style={S.card}>
            <div style={S.labelRed}>★ Favorites</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {favorites.map((f,i)=>(
                <button key={i} onClick={()=>addFoodItem({ ...f, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), id:Date.now() })}
                  style={{ background:CARD2, border:`1px solid ${BORDER}`, borderBottom:`2px solid ${RED}`, borderRadius:0, padding:"8px 12px", cursor:"pointer", textAlign:"left" }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:14, letterSpacing:0.5 }}>{f.name}</div>
                  <div style={{ fontSize:10, color:RED, fontWeight:600 }}>{Math.round(f.calories)} kcal</div>
                </button>
              ))}
            </div>
          </div>}

          {(() => {
              const dayLog = foodLog.filter(f => new Date(f.id).toDateString()===logDate);
              if (dayLog.length===0) return (
                <div style={{ ...S.card, textAlign:"center", padding:"36px 20px" }}>
                  <div style={{ fontSize:34, marginBottom:10 }}>🍽️</div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:1, marginBottom:6 }}>
                    {logDate===new Date().toDateString()?"No food logged yet":"Nothing logged this day"}
                  </div>
                  <div style={{ fontSize:12, color:MUTED, marginBottom:16 }}>
                    {logDate===new Date().toDateString()?"Search, scan a photo, or scan a barcode to add meals":""}
                  </div>
                  {logDate===new Date().toDateString()&&<button style={S.btn} onClick={()=>setShowAddFood(true)}>Log Food</button>}
                </div>
              );
              const MEAL_ORDER = ["Breakfast","Lunch","Dinner","Snack","Pre-Workout","Post-Workout","Other"];
              const grouped = {};
              [...dayLog].reverse().forEach(f => {
                const key = f.mealType || "Other";
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(f);
              });
              return MEAL_ORDER.filter(m => grouped[m]).map(meal => (
                <div key={meal}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, marginTop:4 }}>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:2 }}>{meal}</div>
                    <div style={{ fontSize:11, color:MUTED }}>{Math.round(grouped[meal].reduce((a,f)=>a+(f.calories||0),0))} kcal</div>
                  </div>
                  {grouped[meal].map(f=>(
                    <div key={f.id} style={S.card}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:600, fontSize:14 }}>{f.name}</div>
                          <div style={{ fontSize:11, color:MUTED }}>{f.serving} · {f.time}</div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                          <button onClick={()=>toggleFavorite(f)} style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:16, color:favorites.find(x=>x.name===f.name)?RED:BORDER, lineHeight:1, padding:"2px 4px" }}>
                            {favorites.find(x=>x.name===f.name)?"★":"☆"}
                          </button>
                          <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, color:RED }}>{Math.round(f.calories)}</div>
                          <button onClick={()=>setEditingFood(editingFood===f.id?null:f.id)} style={{ background:"transparent", border:`1px solid ${BORDER}`, cursor:"pointer", color:MUTED, fontSize:11, padding:"3px 7px" }}>✏️</button>
                          <button onClick={()=>deleteFoodItem(f.id)} style={{ background:"transparent", border:`1px solid ${BORDER}`, cursor:"pointer", color:MUTED, fontSize:12, lineHeight:1, padding:"3px 7px" }}>✕</button>
                        </div>
                      </div>
                      <div style={{ display:"flex", gap:6, marginBottom:editingFood===f.id?10:0 }}>
                        <span style={S.pill(BLACK)}>P: {Math.round(f.protein)}g</span>
                        <span style={S.pill(MUTED)}>C: {Math.round(f.carbs)}g</span>
                        <span style={S.pill(RED)}>F: {Math.round(f.fat)}g</span>
                      </div>
                      {editingFood===f.id&&(
                        <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:10 }}>
                          <div style={{ fontSize:11, color:MUTED, marginBottom:8, letterSpacing:1 }}>EDIT ENTRY</div>
                          <input defaultValue={f.name} onBlur={e=>editFoodItem(f.id,{name:e.target.value})} style={{ ...S.input, fontSize:13, marginBottom:8 }} placeholder="Food name"/>
                          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                            <div style={{ flex:1 }}><div style={{ fontSize:10, color:MUTED, marginBottom:3 }}>KCAL</div><input type="text" inputMode="decimal" defaultValue={f.calories} onBlur={e=>editFoodItem(f.id,{calories:parseFloat(e.target.value)||f.calories})} style={{ ...S.input, textAlign:"center", padding:"6px 4px" }}/></div>
                            <div style={{ flex:1 }}><div style={{ fontSize:10, color:MUTED, marginBottom:3 }}>PROTEIN</div><input type="text" inputMode="decimal" defaultValue={f.protein} onBlur={e=>editFoodItem(f.id,{protein:parseFloat(e.target.value)||f.protein})} style={{ ...S.input, textAlign:"center", padding:"6px 4px" }}/></div>
                            <div style={{ flex:1 }}><div style={{ fontSize:10, color:MUTED, marginBottom:3 }}>CARBS</div><input type="text" inputMode="decimal" defaultValue={f.carbs} onBlur={e=>editFoodItem(f.id,{carbs:parseFloat(e.target.value)||f.carbs})} style={{ ...S.input, textAlign:"center", padding:"6px 4px" }}/></div>
                            <div style={{ flex:1 }}><div style={{ fontSize:10, color:MUTED, marginBottom:3 }}>FAT</div><input type="text" inputMode="decimal" defaultValue={f.fat} onBlur={e=>editFoodItem(f.id,{fat:parseFloat(e.target.value)||f.fat})} style={{ ...S.input, textAlign:"center", padding:"6px 4px" }}/></div>
                          </div>
                          <button onClick={()=>setEditingFood(null)} style={{ ...S.btnSm, width:"100%", textAlign:"center" }}>✓ Done</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ));
            })()
          }
        </>)}

        {/* ── WORKOUT ── */}
        {tab==="workout"&&!activeSession&&(<>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, letterSpacing:2, marginBottom:4 }}>Workouts</div>
          <div style={{ fontSize:12, color:MUTED, marginBottom:14 }}>Select a regimen or log cardio</div>

          {/* ── CARDIO SECTION ── */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <div style={S.labelRed}>🏃 Cardio</div>
            <button style={S.btnSmRed} onClick={()=>setShowCardioForm(v=>!v)}>{showCardioForm?"▲ Cancel":"+ Log Cardio"}</button>
          </div>

          {showCardioForm&&<div style={S.card}>
            <div style={{ marginBottom:12 }}>
              <div style={S.label}>ACTIVITY TYPE</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {["Run","Walk","Cycle","Swim","Row","Elliptical","Jump Rope","Other"].map(t=>(
                  <button key={t} onClick={()=>setNewCardio(c=>({...c,type:t,caloriesEstimated:null,caloriesBurned:""}))}
                    style={{ padding:"6px 12px", fontFamily:"'DM Sans'", fontSize:12, background:newCardio.type===t?RED:CARD2, color:newCardio.type===t?WHITE:TEXT, border:`1px solid ${newCardio.type===t?RED:BORDER}`, cursor:"pointer" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:12 }}>
              <div style={{ flex:1 }}>
                <div style={S.label}>DURATION (mins)</div>
                <input style={S.input} type="text" inputMode="numeric" placeholder="e.g. 30" value={newCardio.duration} onChange={e=>setNewCardio(c=>({...c,duration:e.target.value,caloriesEstimated:null,caloriesBurned:""}))}/>
              </div>
              <div style={{ flex:1 }}>
                <div style={S.label}>DISTANCE (optional)</div>
                <input style={S.input} type="text" inputMode="decimal" placeholder="e.g. 3.1 mi" value={newCardio.distance} onChange={e=>setNewCardio(c=>({...c,distance:e.target.value}))}/>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={S.label}>PERCEIVED EFFORT (1=easy · 5=max)</div>
              <StarRating value={newCardio.effort} onChange={v=>setNewCardio(c=>({...c,effort:v,caloriesEstimated:null,caloriesBurned:""}))} color={RED}/>
            </div>

            {/* Calories burned */}
            <div style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={S.label}>CALORIES BURNED</div>
                {newCardio.duration&&<button onClick={estimateCardioCalories} disabled={newCardio.estimatingCals}
                  style={{ background:"transparent", border:`1px solid ${RED}`, color:RED, fontSize:11, fontFamily:"'DM Sans'", padding:"4px 10px", cursor:"pointer", letterSpacing:0.5 }}>
                  {newCardio.estimatingCals?"⚡ Estimating...":"⚡ AI Estimate"}
                </button>}
              </div>
              {newCardio.caloriesEstimated&&(
                <div style={{ background:BLACK, padding:"10px 12px", marginBottom:8, borderLeft:`3px solid ${RED}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                    <div style={{ fontFamily:"'Bebas Neue'", fontSize:28, color:RED }}>{newCardio.caloriesEstimated.calories} <span style={{ fontSize:13, color:MUTED }}>kcal</span></div>
                    <span style={{ fontSize:10, color:"#555", background:"#1a1a1a", padding:"3px 8px", letterSpacing:1 }}>AI ESTIMATE</span>
                  </div>
                  <div style={{ fontSize:11, color:"#666", lineHeight:1.5 }}>{newCardio.caloriesEstimated.note}</div>
                </div>
              )}
              <div style={{ position:"relative" }}>
                <input style={S.input} type="text" inputMode="decimal" placeholder={newCardio.caloriesEstimated?"Edit if you have watch data...":"Enter or tap AI Estimate above"} value={newCardio.caloriesBurned}
                  onChange={e=>setNewCardio(c=>({...c,caloriesBurned:e.target.value}))}/>
                {newCardio.caloriesBurned&&newCardio.caloriesEstimated&&parseInt(newCardio.caloriesBurned)!==newCardio.caloriesEstimated.calories&&(
                  <div style={{ fontSize:10, color:MUTED, marginTop:3 }}>⌚ Using your device data</div>
                )}
              </div>
            </div>

            <button style={S.btn} onClick={addCardio}>✓ Log Cardio Session</button>
          </div>}

          {cardioLog.length>0&&<div style={S.card}>
            <div style={S.label}>Recent Cardio</div>
            {cardioLog.length>=2&&<><CardioChart data={[...cardioLog].slice(-10)}/><div style={{ fontSize:10, color:MUTED, textAlign:"center", marginTop:2, marginBottom:8 }}>Duration trend (last {Math.min(cardioLog.length,10)} sessions)</div></>}
            {[...cardioLog].reverse().slice(0,5).map(c=>(
              <div key={c.id} style={{ ...S.card2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{c.type}</div>
                  <div style={{ fontSize:11, color:MUTED }}>{c.date} · Effort {c.effort}/5{c.distance?` · ${c.distance} mi`:""}</div>
                  {c.caloriesBurned&&<div style={{ fontSize:11, color:RED, fontWeight:600, marginTop:2 }}>{c.caloriesBurned} kcal burned</div>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:TEXT }}>{c.duration}m</span>
                  <button onClick={()=>setCardioLog(p=>p.filter(x=>x.id!==c.id))} style={{ background:"transparent", border:`1px solid ${BORDER}`, color:MUTED, fontSize:11, padding:"3px 7px", cursor:"pointer" }}>✕</button>
                </div>
              </div>
            ))}
          </div>}

          <div style={S.labelRed}>🏋️ Strength</div>
          {sessions.length>0&&<div style={S.card}>
            <div style={S.label}>Workout History</div>
            {[...sessions].reverse().slice(0,10).map(s=>(
              <div key={s.id} style={{ marginBottom:6 }}>
                <div style={{ ...S.card2, cursor:"pointer" }} onClick={()=>setExpandedSession(expandedSession===s.id?null:s.id)}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{s.name}</div>
                      <div style={{ fontSize:11, color:MUTED }}>{s.date} · {s.exercises?.length} exercises · {s.start}–{s.end}{s.duration?` · ${Math.round(s.duration/60)}min`:""}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      {s.exercises?.some(ex=>ex.sets?.some(st=>parseFloat(st.weight)>0&&personalRecords[ex.name]===parseFloat(st.weight)))&&
                        <span style={{ background:RED, color:WHITE, fontSize:9, padding:"2px 6px", fontFamily:"'Bebas Neue'", letterSpacing:1 }}>PR</span>}
                      <button onClick={e=>{ e.stopPropagation(); setSessions(p=>p.filter(x=>x.id!==s.id)); }}
                        style={{ background:"transparent", border:`1px solid ${BORDER}`, color:MUTED, fontSize:11, padding:"2px 7px", cursor:"pointer" }}>✕</button>
                      <span style={{ color:MUTED, fontSize:16 }}>{expandedSession===s.id?"▲":"▼"}</span>
                    </div>
                  </div>
                </div>
                {expandedSession===s.id&&(
                  <div style={{ background:CARD, border:`1px solid ${BORDER}`, borderTop:"none", padding:"10px 12px" }}>
                    {s.exercises?.map((ex,ei)=>(
                      <div key={ei} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:1, cursor:"pointer" }}
                            onClick={()=>setVolumeExercise(volumeExercise===ex.name?null:ex.name)}>{ex.name}</div>
                          {personalRecords[ex.name]&&ex.sets?.some(st=>parseFloat(st.weight)===personalRecords[ex.name])&&
                            <span style={{ background:RED, color:WHITE, fontSize:9, padding:"1px 5px", fontFamily:"'Bebas Neue'", letterSpacing:1 }}>PR {personalRecords[ex.name]}lbs</span>}
                          <span style={{ fontSize:10, color:MUTED, cursor:"pointer" }} onClick={()=>setVolumeExercise(volumeExercise===ex.name?null:ex.name)}>📈</span>
                        </div>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          {ex.sets?.map((st,si)=>(st.reps||st.weight)&&(
                            <span key={si} style={{ background:CARD2, border:`1px solid ${BORDER}`, fontSize:11, padding:"3px 8px", fontFamily:"'DM Sans'" }}>
                              {si+1}: {st.reps||"—"} reps @ {st.weight||"—"} lbs
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>}

          {/* Volume chart */}
          {sessions.length>=2&&(()=>{
            const allExercises = [...new Set(sessions.flatMap(s=>s.exercises?.map(e=>e.name)||[]))];
            if(!allExercises.length) return null;
            return (
              <div style={S.card}>
                <div style={S.label}>Volume Progression</div>
                <div style={{ fontSize:11, color:MUTED, marginBottom:10 }}>Select an exercise to chart volume (sets × reps × weight) over time</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                  {allExercises.slice(0,8).map(ex=>(
                    <button key={ex} onClick={()=>setVolumeExercise(volumeExercise===ex?null:ex)}
                      style={{ padding:"5px 10px", fontFamily:"'DM Sans'", fontSize:11, background:volumeExercise===ex?RED:CARD2, color:volumeExercise===ex?WHITE:TEXT, border:`1px solid ${volumeExercise===ex?RED:BORDER}`, cursor:"pointer" }}>
                      {ex}
                    </button>
                  ))}
                </div>
                {volumeExercise
                  ? <><div style={{ fontFamily:"'Bebas Neue'", fontSize:13, color:RED, letterSpacing:1, marginBottom:8 }}>{volumeExercise} — Volume Trend</div>
                      <VolumeChart sessions={sessions} exercise={volumeExercise}/>
                      <div style={{ fontSize:10, color:MUTED, textAlign:"center", marginTop:4 }}>Volume = sets × reps × weight (lbs) per session</div>
                    </>
                  : <div style={{ textAlign:"center", padding:"16px 0", color:MUTED, fontSize:12 }}>Select an exercise above to see your progression</div>
                }
              </div>
            );
          })()}
          <div style={S.labelRed}>Quick Start</div>
          <div style={{ fontSize:12, color:MUTED, marginBottom:10 }}>Pick a template or build your own from scratch.</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
            {SAMPLE_WORKOUTS.map(w=>(
              <button key={w.id} onClick={()=>startWorkout(w)}
                style={{ background:CARD, border:`1px solid ${BORDER}`, borderBottom:`2px solid ${RED}`, padding:"10px 14px", cursor:"pointer", textAlign:"left", width:"calc(50% - 4px)", boxSizing:"border-box" }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:1, color:TEXT }}>{w.name}</div>
                <div style={{ fontSize:10, color:MUTED, marginTop:2 }}>{w.exercises.length} exercises · tap to load</div>
              </button>
            ))}
            {/* My Build tile */}
            <button onClick={()=>startWorkout({ name:"型 — My Build", exercises:[] })}
              style={{ background:BLACK, border:`1px solid ${RED}`, borderBottom:`2px solid ${RED}`, padding:"10px 14px", cursor:"pointer", textAlign:"left", width:"calc(50% - 4px)", boxSizing:"border-box" }}>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, letterSpacing:1, color:WHITE }}>型 — MY BUILD</div>
              <div style={{ fontSize:10, color:RED, marginTop:2 }}>Start from scratch</div>
            </button>
          </div>
          {customWorkouts.length>0&&<>
            <div style={S.label}>My Saved Workouts</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
              {customWorkouts.map(w=>(
                <button key={w.id} onClick={()=>startWorkout(w, true)}
                  style={{ background:CARD, border:`1px solid ${BORDER}`, borderBottom:`2px solid ${RED}`, padding:"10px 14px", cursor:"pointer", textAlign:"left", width:"calc(50% - 4px)", boxSizing:"border-box", position:"relative" }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:1, color:TEXT }}>{w.name}</div>
                  <div style={{ fontSize:10, color:MUTED, marginTop:2 }}>{w.exercises.length} exercises</div>
                  <span onClick={e=>{ e.stopPropagation(); setCustomWorkouts(p=>p.filter(x=>x.id!==w.id)); }}
                    style={{ position:"absolute", top:4, right:4, fontSize:11, color:MUTED, cursor:"pointer", padding:"1px 4px" }}>✕</span>
                </button>
              ))}
            </div>
          </>}
          
        </>)}

        {tab==="workout"&&activeSession&&(<>
          {/* Rest Timer Overlay */}
          {restTimer && (
            <div style={{ background:BLACK, border:`2px solid ${RED}`, padding:"14px 16px", marginBottom:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:RED, letterSpacing:2, marginBottom:2 }}>REST TIMER</div>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:40, color:restTimer.seconds<=10?RED:WHITE, lineHeight:1 }}>{formatTime(restTimer.seconds)}</div>
                {/* Progress bar */}
                <div style={{ width:160, height:3, background:"#333", marginTop:6 }}>
                  <div style={{ height:"100%", background:RED, width:`${(restTimer.seconds/restTimer.max)*100}%`, transition:"width 1s linear" }}/>
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                <button onClick={()=>setRestTimer(null)} style={{ background:RED, color:WHITE, border:"none", padding:"8px 14px", fontFamily:"'Bebas Neue'", fontSize:13, letterSpacing:1, cursor:"pointer" }}>Skip</button>
                <div style={{ display:"flex", gap:4 }}>
                  {[60,90,120].map(s=>(
                    <button key={s} onClick={()=>setRestTimer({seconds:s,max:s})}
                      style={{ flex:1, background:"transparent", color:MUTED, border:`1px solid #333`, fontSize:10, fontFamily:"'Bebas Neue'", padding:"4px 2px", cursor:"pointer", letterSpacing:0.5 }}>
                      {s}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Session header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:20, letterSpacing:1 }}>{activeSession.name}</div>
              <div style={{ fontSize:11, color:MUTED }}>
                {activeSession.exercises.length} exercise{activeSession.exercises.length!==1?"s":""} · <span style={{ color:timerRunning?RED:MUTED, fontFamily:"'Bebas Neue'", fontSize:13 }}>{formatTime(workoutSeconds)}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {!timerRunning
                ? <button style={{ background:RED, color:WHITE, border:"none", padding:"8px 12px", fontFamily:"'Bebas Neue'", fontSize:12, letterSpacing:1, cursor:"pointer" }}
                    onClick={()=>setTimerRunning(true)}>
                    始 START
                  </button>
                : <button style={{ background:"transparent", color:RED, border:`1px solid ${RED}`, padding:"8px 12px", fontFamily:"'Bebas Neue'", fontSize:12, letterSpacing:1, cursor:"pointer" }}
                    onClick={()=>setTimerRunning(false)}>
                    止 PAUSE
                  </button>
              }
              <button style={{ ...S.btnSm, color:MUTED }} onClick={()=>{ setActiveSession(null); setTimerRunning(false); setWorkoutSeconds(0); }}>Quit</button>
            </div>
          </div>

          {/* Empty state */}
          {activeSession.exercises.length===0&&!showExercisePicker&&(
            <div style={{ ...S.card, textAlign:"center", padding:"32px 20px", marginBottom:8 }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🏋️</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:1, marginBottom:6 }}>Ready to Train</div>
              <div style={{ fontSize:12, color:MUTED, marginBottom:20 }}>Add your first exercise to get started</div>
              <button style={S.btn} onClick={()=>{ setShowExercisePicker(true); setExerciseSearch(""); }}>+ Add Exercise</button>
            </div>
          )}

          {/* Exercise list */}
          {activeSession.exercises.map((ex,ei)=>(
            <div key={ei} style={S.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:15, letterSpacing:1, color:RED }}>{ex.name}</div>
                <div style={{ display:"flex", gap:6 }}>
                  <button onClick={()=>setExerciseDetail(ex.name)}
                    style={{ background:"transparent", border:`1px solid #444`, color:MUTED, cursor:"pointer", fontSize:12, padding:"2px 8px", letterSpacing:1 }}>ⓘ</button>
                  <button onClick={()=>setActiveSession(s=>({ ...s, exercises:s.exercises.filter((_,i)=>i!==ei) }))}
                    style={{ background:"transparent", border:"none", color:MUTED, cursor:"pointer", fontSize:14, padding:"2px 6px" }}>✕</button>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, marginBottom:5 }}>
                <span style={{ flex:0.4, fontSize:9, color:MUTED, textAlign:"center", letterSpacing:1 }}>SET</span>
                <span style={{ flex:1, fontSize:9, color:MUTED, textAlign:"center", letterSpacing:1 }}>REPS</span>
                <span style={{ flex:1, fontSize:9, color:MUTED, textAlign:"center", letterSpacing:1 }}>LBS</span>
                <span style={{ flex:0.4, fontSize:9, color:MUTED, textAlign:"center", letterSpacing:1 }}>✓</span>
                <span style={{ flex:0.3 }}/>
              </div>
              {ex.sets.map((st,si)=>(
                <div key={si}>
                  <div style={{ ...S.setRow, alignItems:"center", opacity:st.done?0.55:1, background:st.done?`${RED}08`:"transparent", borderLeft:st.done?`2px solid ${RED}`:"2px solid transparent", paddingLeft:st.done?6:0, marginBottom:2, transition:"all 0.2s" }}>
                    <span style={{ flex:0.4, fontFamily:"'Bebas Neue'", fontSize:17, color:st.done?RED:MUTED, textAlign:"center" }}>{si+1}</span>
                    <input style={{ ...S.input, flex:1, textAlign:"center", padding:"7px 4px" }} placeholder="—" value={st.reps} inputMode="numeric" onChange={e=>updateSet(ei,si,"reps",e.target.value)}/>
                    <input style={{ ...S.input, flex:1, textAlign:"center", padding:"7px 4px" }} placeholder="—" value={st.weight} inputMode="decimal" onChange={e=>updateSet(ei,si,"weight",e.target.value)}/>
                    <button onClick={()=>toggleSetDone(ei,si)}
                      style={{ flex:0.4, background:st.done?RED:"transparent", border:`1px solid ${st.done?RED:BORDER}`, color:st.done?WHITE:MUTED, cursor:"pointer", fontSize:13, padding:"6px 0", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {st.done?"✓":"○"}
                    </button>
                    <button onClick={()=>setActiveSession(s=>({ ...s, exercises:s.exercises.map((ex2,i)=>i!==ei?ex2:{ ...ex2, sets:ex2.sets.filter((_,j)=>j!==si) }) }))}
                      style={{ flex:0.3, background:"transparent", border:"none", color:MUTED, cursor:"pointer", fontSize:13 }}>✕</button>
                  </div>
                  {/* Rest timer trigger — shows after set is done */}
                  {st.done && !restTimer && (
                    <button onClick={()=>setRestTimer({ seconds:restDuration, max:restDuration })}
                      style={{ width:"100%", background:"#111", border:`1px solid #333`, borderTop:"none", color:RED, fontFamily:"'Bebas Neue'", fontSize:12, letterSpacing:2, padding:"6px 0", cursor:"pointer", marginBottom:4, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                      ⏱ 休 START REST · {restDuration}s
                    </button>
                  )}
                  {st.done && restTimer && (
                    <div style={{ width:"100%", background:RED+"22", border:`1px solid ${RED}`, borderTop:"none", color:RED, fontFamily:"'Bebas Neue'", fontSize:12, letterSpacing:2, padding:"6px 0", marginBottom:4, textAlign:"center" }}>
                      ⏱ REST · {formatTime(restTimer.seconds)}
                    </div>
                  )}
                </div>
              ))}
              <button style={{ ...S.btnSm, width:"100%", marginTop:6, borderStyle:"dashed" }} onClick={()=>addSet(ei)}>+ Set</button>
            </div>
          ))}

          {/* Exercise Picker */}
          {showExercisePicker && <div style={S.card}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={S.labelRed}>Add Exercise</div>
                <button style={S.btnSm} onClick={()=>{ setShowExercisePicker(false); setExerciseSearch(""); }}>✕ Close</button>
              </div>
              <input style={{ ...S.input, marginBottom:10 }} placeholder="Search exercises..." value={exerciseSearch}
                onChange={e=>setExerciseSearch(e.target.value)} autoFocus/>
              {/* Template suggestions */}
              {!exerciseSearch && activeSession.template?.length>0&&(
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:RED, letterSpacing:2, marginBottom:6 }}>FROM {activeSession.name.toUpperCase()}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {activeSession.template.map(ex=>{
                      const already = activeSession.exercises.find(e=>e.name===ex);
                      return (
                        <div key={ex} style={{ display:"flex", alignItems:"center", gap:0 }}>
                          <button onClick={()=>{ if(already) return; addExerciseToSession(ex); }}
                            style={{ padding:"7px 12px", fontFamily:"'DM Sans'", fontSize:12, background:already?CARD2:RED, color:already?MUTED:WHITE, border:`1px solid ${already?BORDER:RED}`, borderRight:"none", cursor:already?"default":"pointer" }}>
                            {ex}{already?" ✓":""}
                          </button>
                          <button onClick={()=>setExerciseDetail(ex)}
                            style={{ padding:"7px 7px", fontSize:11, background:"#1a1a1a", color:MUTED, border:`1px solid ${BORDER}`, cursor:"pointer" }}>ⓘ</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Custom entry */}
              {exerciseSearch.trim() && !Object.values(EXERCISE_LIBRARY).flat().find(e=>e.toLowerCase()===exerciseSearch.trim().toLowerCase()) && (
                <button onClick={()=>{ addExerciseToSession(exerciseSearch.trim()); setExerciseSearch(""); setShowExercisePicker(false); }}
                  style={{ ...S.btn, marginBottom:10 }}>+ Add "{exerciseSearch.trim()}"</button>
              )}
              {/* Library grouped */}
              <div style={{ maxHeight:340, overflowY:"auto" }}>
                {Object.entries(EXERCISE_LIBRARY).map(([group, exs])=>{
                  const filtered = exs.filter(e=>e.toLowerCase().includes(exerciseSearch.toLowerCase()));
                  if (!filtered.length) return null;
                  return (
                    <div key={group} style={{ marginBottom:12 }}>
                      <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:RED, letterSpacing:2, marginBottom:6 }}>{group}</div>
                      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                        {filtered.map(ex=>{
                          const already = activeSession.exercises.find(e=>e.name===ex);
                          return (
                            <div key={ex} style={{ display:"flex", alignItems:"center", gap:0 }}>
                              <button onClick={()=>{ if(already) return; addExerciseToSession(ex); }}
                                style={{ padding:"6px 10px", fontFamily:"'DM Sans'", fontSize:12, background:already?CARD2:CARD, color:already?MUTED:TEXT, border:`1px solid ${already?BORDER:RED}`, borderRight:"none", cursor:already?"default":"pointer", opacity:already?0.6:1 }}>
                                {ex}{already?" ✓":""}
                              </button>
                              <button onClick={()=>setExerciseDetail(ex)}
                                style={{ padding:"6px 7px", fontSize:11, background:"#1a1a1a", color:MUTED, border:`1px solid ${BORDER}`, cursor:"pointer" }}>ⓘ</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          }

          {activeSession.exercises.length > 0 && !showExercisePicker && (
            <button style={{ ...S.btnBlack, marginBottom:8 }} onClick={()=>{ setShowExercisePicker(true); setExerciseSearch(""); }}>
              + Add Exercise
            </button>
          )}

          {/* Save & Finish */}
          {!showExercisePicker&&<>
            {/* Rest duration selector */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
              <span style={{ fontSize:11, color:MUTED, flexShrink:0 }}>Rest timer:</span>
              {[{s:60,label:"1M"},{s:90,label:"1.5M"},{s:120,label:"2M"},{s:180,label:"3M"}].map(({s,label})=>(
                <button key={s} onClick={()=>setRestDuration(s)}
                  style={{ flex:1, padding:"6px 0", fontFamily:"'Bebas Neue'", fontSize:12, background:restDuration===s?RED:CARD2, color:restDuration===s?WHITE:MUTED, border:`1px solid ${restDuration===s?RED:BORDER}`, cursor:"pointer" }}>
                  {label}
                </button>
              ))}
            </div>

            {showSaveWorkout
              ? <div style={{ ...S.card, display:"flex", gap:8 }}>
                  <input style={{ ...S.input, flex:1 }} placeholder="Name this workout..." value={saveWorkoutName} onChange={e=>setSaveWorkoutName(e.target.value)} autoFocus/>
                  <button style={S.btnSmRed} onClick={()=>{ saveCurrentWorkout(saveWorkoutName); setSaveWorkoutName(""); setShowSaveWorkout(false); }}>Save</button>
                  <button style={S.btnSm} onClick={()=>setShowSaveWorkout(false)}>✕</button>
                </div>
              : <button style={{ ...S.btnBlack, marginBottom:8 }} onClick={()=>setShowSaveWorkout(true)}>💾 保存 Save as Template</button>
            }
            <button style={S.btn} onClick={finishWorkout}>
              完 FINISH WORKOUT · {formatTime(workoutSeconds)}
            </button>
          </>}
        </>)}

        {/* ── HEALTH ── */}
        {tab==="health"&&(<>
          <div style={{ fontFamily:"'Bebas Neue'", fontSize:24, letterSpacing:2, marginBottom:12 }}>Health Center</div>
          <div style={{ display:"flex", marginBottom:14, borderBottom:`2px solid ${BORDER}` }}>
            {[{ id:"metrics", label:"⚖️ Body" },{ id:"sleep", label:"😴 Sleep" },{ id:"photos", label:"📸 Photos" },{ id:"ai", label:"🤖 AI Plan" }].map(t=>(
              <button key={t.id} style={S.subTab(healthSub===t.id)} onClick={()=>setHealthSub(t.id)}>{t.label}</button>
            ))}
          </div>

          {healthSub==="metrics"&&(<>
            <div style={S.card}>
              <div style={S.labelRed}>Log Weight (lbs)</div>
              <div style={{ display:"flex", gap:8 }}>
                <input style={{ ...S.input, flex:1 }} placeholder="e.g. 185.5" value={newWeight} onChange={e=>setNewWeight(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addMetric()} type="text" inputMode="decimal"/>
                <button style={S.btnSmRed} onClick={addMetric}>Log</button>
              </div>
            </div>
            {bodyMetrics.length>0&&<div style={S.card}>
              <div style={S.label}>Weight Trend</div>
              <WeightChart data={bodyMetrics}/>
              <div style={{ marginTop:10 }}>
                {[...bodyMetrics].reverse().slice(0,5).map(m=>(
                  <div key={m.id} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${BORDER}` }}>
                    <span style={{ fontSize:12, color:MUTED }}>{m.date}</span>
                    <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED }}>{m.weight} lbs</span>
                  </div>
                ))}
              </div>
            </div>}
            {bodyMetrics.length===0&&<div style={{ ...S.card, textAlign:"center", padding:"36px 20px" }}>
              <div style={{ fontSize:34, marginBottom:10 }}>⚖️</div>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:1, marginBottom:6 }}>No weight logged yet</div>
              <div style={{ fontSize:12, color:MUTED }}>Enter your weight above to start tracking</div>
            </div>}

            {/* Body Measurements */}
            <div style={{ ...S.labelRed, marginTop:6 }}>📏 Body Measurements (inches)</div>
            <div style={S.card}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                {["chest","waist","hips","arms","thighs"].map(m=>(
                  <div key={m}>
                    <div style={{ fontSize:10, color:MUTED, letterSpacing:1, marginBottom:3 }}>{m.toUpperCase()}</div>
                    <input style={{ ...S.input, padding:"7px 8px" }} type="text" inputMode="decimal" placeholder="e.g. 36" value={newMeasurement[m]}
                      onChange={e=>setNewMeasurement(p=>({...p,[m]:e.target.value}))}/>
                  </div>
                ))}
              </div>
              <button style={S.btnSmRed} onClick={addMeasurement}>Log Measurements</button>
            </div>
            {bodyMeasurements.length>0&&<div style={S.card}>
              <div style={S.label}>Measurement History</div>
              {[...bodyMeasurements].reverse().slice(0,5).map(m=>(
                <div key={m.id} style={{ ...S.card2, marginBottom:6 }}>
                  <div style={{ fontSize:11, color:MUTED, marginBottom:4 }}>{m.date}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {["chest","waist","hips","arms","thighs"].filter(k=>m[k]).map(k=>(
                      <span key={k} style={{ fontSize:12 }}><span style={{ color:MUTED }}>{k}: </span><strong>{m[k]}"</strong></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>}

            {/* Notifications */}
            <div style={{ ...S.labelRed, marginTop:6 }}>🔔 Reminders</div>
            <div style={{ ...S.card, borderLeft:`3px solid ${notifEnabled?RED:BORDER}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:2 }}>Push Notifications</div>
                  <div style={{ fontSize:11, color:MUTED, lineHeight:1.5 }}>
                    {notifEnabled?"Notifications are enabled ✅":"Get reminders to log meals, drink water, and keep your streak."}
                  </div>
                </div>
                {!notifEnabled
                  ? <button style={{ ...S.btnSmRed, flexShrink:0, marginLeft:10 }} onClick={enableNotifications}>Enable</button>
                  : <button style={{ ...S.btnSm, flexShrink:0, marginLeft:10 }} onClick={()=>setNotifEnabled(false)}>Disable</button>
                }
              </div>
            </div>
          </>)}

          {healthSub==="sleep"&&(<>
            <div style={S.card}>
              <div style={S.labelRed}>Log Last Night's Sleep</div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:6 }}>HOURS SLEPT</div>
                <input style={S.input} placeholder="e.g. 7.5" value={newSleep.hours} onChange={e=>setNewSleep(s=>({ ...s, hours:e.target.value }))} type="text" inputMode="decimal" step="0.5"/>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:8 }}>SLEEP QUALITY</div>
                <StarRating value={newSleep.quality} onChange={v=>setNewSleep(s=>({ ...s, quality:v }))} color={RED}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:8 }}>MUSCLE SORENESS (1=none · 5=destroyed)</div>
                <StarRating value={newSleep.soreness} onChange={v=>setNewSleep(s=>({ ...s, soreness:v }))} color={BLACK}/>
              </div>
              <button style={S.btn} onClick={addSleep}>Log Recovery</button>
            </div>
            {recoveryScore!==null&&<div style={S.card}>
              <div style={S.labelRed}>Recovery Score</div>
              <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ width:76, height:76, background:recoveryScore>70?RED:recoveryScore>40?BLACK:MUTED, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontFamily:"'Bebas Neue'", fontSize:32, color:WHITE }}>{recoveryScore}</span>
                </div>
                <div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:1 }}>{recoveryScore>70?"Ready to Train":recoveryScore>40?"Train Light":"Rest Day"}</div>
                  <div style={{ fontSize:12, color:MUTED, marginTop:4, lineHeight:1.5 }}>
                    {recoveryScore>70?"You're fully recovered. Hit it hard.":recoveryScore>40?"Consider lighter session or active recovery.":"Your body needs rest. Prioritize sleep tonight."}
                  </div>
                </div>
              </div>
            </div>}
            {sleepLog.length>0&&<div style={S.card}>
              <div style={S.label}>Sleep Trend</div>
              <SleepChart data={[...sleepLog].slice(-14)}/>
              <div style={{ fontSize:10, color:MUTED, textAlign:"center", marginTop:4 }}>Dashed line = 8hr target · Red dots = under 7hrs</div>
              <div style={{ marginTop:10 }}>
                {[...sleepLog].reverse().slice(0,5).map(s=>(
                  <div key={s.id} style={{ ...S.card2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div><div style={{ fontSize:11, color:MUTED }}>{s.date}</div><div style={{ fontSize:12, marginTop:2 }}>Quality {s.quality}/5 · Soreness {s.soreness}/5</div></div>
                    <span style={{ fontFamily:"'Bebas Neue'", fontSize:22, color:parseFloat(s.hours)>=7?BLACK:RED }}>{s.hours}h</span>
                  </div>
                ))}
              </div>
            </div>}
          </>)}

          {healthSub==="photos"&&(<>
            <div style={S.card}>
              <div style={S.labelRed}>📸 Progress Photos</div>
              <div style={{ fontSize:12, color:MUTED, marginBottom:12, lineHeight:1.6 }}>Log a weekly photo to track your visual progress alongside your weight.</div>
              <input ref={progressPhotoRef} type="file" accept="image/*" {...(isMobile?{capture:"environment"}:{})} style={{ display:"none" }}
                onChange={e=>{ const file=e.target.files[0]; if(!file) return; const r=new FileReader(); r.onload=ev=>{ addProgressPhoto(ev.target.result.split(",")[1]); }; r.readAsDataURL(file); }}/>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ ...S.btn, flex:1 }} onClick={()=>progressPhotoRef.current?.click()}>📷 Take Photo</button>
              </div>
            </div>
            {progressPhotos.length===0
              ? <div style={{ ...S.card, textAlign:"center", padding:"36px 20px" }}>
                  <div style={{ fontSize:34, marginBottom:10 }}>📸</div>
                  <div style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:1, marginBottom:6 }}>No photos yet</div>
                  <div style={{ fontSize:12, color:MUTED }}>Take a weekly photo to track your visual transformation</div>
                </div>
              : <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[...progressPhotos].reverse().map(p=>(
                    <div key={p.id} style={{ position:"relative" }}>
                      <img src={`data:image/jpeg;base64,${p.base64}`} alt="Progress" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block" }}/>
                      <div style={{ background:"rgba(0,0,0,0.7)", padding:"4px 8px", fontSize:10, color:WHITE, position:"absolute", bottom:0, left:0, right:0 }}>
                        {p.date}{p.weight?` · ${p.weight} lbs`:""}
                      </div>
                      <button onClick={()=>setProgressPhotos(p2=>p2.filter(x=>x.id!==p.id))} style={{ position:"absolute", top:4, right:4, background:"rgba(0,0,0,0.7)", border:"none", color:WHITE, width:22, height:22, cursor:"pointer", fontSize:12 }}>✕</button>
                    </div>
                  ))}
                </div>
            }
          </>)}

          {healthSub==="ai"&&(<>
            <div style={S.card}>
              <div style={S.labelRed}>AI Meal Planner</div>
              <div style={{ fontSize:12, color:MUTED, marginBottom:14, lineHeight:1.6 }}>Claude builds a personalised 7-day meal plan based on your goal and diet.</div>
              <div style={{ marginBottom:12 }}>
                <div style={{ fontFamily:"'Bebas Neue'", fontSize:11, color:MUTED, letterSpacing:2, marginBottom:6 }}>DIET TYPE</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:8 }}>
                  {DIET_OPTIONS.filter(d=>d!=="Custom").map(d=>(
                    <button key={d} onClick={()=>setPlanPrefs(p=>({...p, dietType:d, restrictions:d==="None"?"":d}))}
                      style={{ padding:"6px 12px", fontFamily:"'DM Sans'", fontSize:12, background:planPrefs.dietType===d?RED:CARD2, color:planPrefs.dietType===d?WHITE:TEXT, border:`1px solid ${planPrefs.dietType===d?RED:BORDER}`, cursor:"pointer", borderRadius:0 }}>
                      {d}
                    </button>
                  ))}
                  <button onClick={()=>setPlanPrefs(p=>({...p, dietType:"Custom"}))}
                    style={{ padding:"6px 12px", fontFamily:"'DM Sans'", fontSize:12, background:planPrefs.dietType==="Custom"?RED:CARD2, color:planPrefs.dietType==="Custom"?WHITE:TEXT, border:`1px solid ${planPrefs.dietType==="Custom"?RED:BORDER}`, cursor:"pointer" }}>
                    Custom ✏️
                  </button>
                </div>
                {planPrefs.dietType==="Custom"&&(
                  <input style={S.input} placeholder="e.g. no dairy, high protein, intermittent fasting..." value={planPrefs.restrictions}
                    onChange={e=>setPlanPrefs(p=>({...p, restrictions:e.target.value}))}/>
                )}
              </div>
              <div style={{ ...S.card2, marginBottom:10, display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, color:MUTED }}>Goal</span><span style={{ fontSize:12, fontWeight:600 }}>{goalLabel[user.goal]}</span>
              </div>
              <div style={{ ...S.card2, marginBottom:14, display:"flex", justifyContent:"space-between" }}>
                <span style={{ fontSize:12, color:MUTED }}>Daily Calories</span><span style={{ fontSize:12, fontWeight:600 }}>{activeGoals.calories} kcal</span>
              </div>
              <button style={S.btn} onClick={generateMealPlan} disabled={generatingPlan}>{generatingPlan?"🤖 Claude is Planning...":"🤖 Generate 7-Day Plan"}</button>
            </div>
            {generatingPlan&&<div style={{ ...S.card, textAlign:"center" }}>
              <YinYang size={40} style={{ margin:"0 auto 12px", mixBlendMode:"multiply" }} className="spin-slow"/>
              <div style={{ fontFamily:"'Bebas Neue'", fontSize:17, letterSpacing:1, marginBottom:4 }}>Building Your Plan...</div>
              <div style={{ fontSize:12, color:MUTED }}>Claude is crafting your personalised meal schedule</div>
            </div>}
            {mealPlan&&mealPlan.days&&mealPlan.days.map((day,di)=>(
              <div key={di} style={S.card}>
                <div style={S.labelRed}>{day.day}</div>
                {day.meals&&day.meals.map((meal,mi)=>(
                  <div key={mi} style={{ ...S.card2, marginBottom:6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
                      <div>
                        <div style={{ fontSize:11, color:RED, fontWeight:600, letterSpacing:0.5 }}>{meal.time}</div>
                        <div style={{ fontSize:13, fontWeight:600, marginTop:1 }}>{meal.name}</div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                        <span style={{ fontFamily:"'Bebas Neue'", fontSize:18, color:RED }}>{meal.calories}</span>
                        <button onClick={()=>addFoodItem({ name:meal.name, calories:meal.calories||0, protein:meal.protein||0, carbs:meal.carbs||0, fat:meal.fat||0, fiber:0, sugar:0, serving:"1 serving", confidence:"high", notes:"From AI meal plan", mealType:meal.time, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), id:Date.now() })}
                          style={{ background:"transparent", border:`1px solid ${RED}`, color:RED, fontSize:10, fontFamily:"'DM Sans'", padding:"3px 8px", cursor:"pointer", letterSpacing:0.5 }}>
                          + Log
                        </button>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6 }}>
                      {meal.protein&&<span style={S.pill(BLACK)}>P: {meal.protein}g</span>}
                      {meal.carbs&&<span style={S.pill(MUTED)}>C: {meal.carbs}g</span>}
                      {meal.fat&&<span style={S.pill(RED)}>F: {meal.fat}g</span>}
                    </div>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"flex-end", marginTop:4 }}>
                  <span style={{ fontSize:11, color:MUTED }}>Day total: <strong style={{ color:TEXT }}>{day.meals?.reduce((a,m)=>a+(m.calories||0),0)} kcal</strong></span>
                </div>
              </div>
            ))}
          </>)}
        </>)}
      </div>

      <nav style={S.nav}>
        {[{ id:"home", label:"Home" },{ id:"log", label:"Log" },{ id:"workout", label:"Train" },{ id:"health", label:"Health" }].map(t=>(
          <button key={t.id} style={S.tab(tab===t.id)} onClick={()=>setTab(t.id)}>
            <TabIcon name={t.id} active={tab===t.id}/>
            <span style={S.tabLabel(tab===t.id)}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ── WELCOME BACK ────────────────────────────────── */
function WelcomeBack({ user, onContinue }) {
  const rank = getRank(0);
  const goalLabel = { cut:"削 Cut", bulk:"増 Bulk", recomp:"変 Recomp", endure:"耐 Endure" };
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };
  return (
    <div style={{ position:"fixed", inset:0, background:BLACK, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:1000, overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${RED},${BLACK})` }}/>

      <YinYang size={90} className="spin-in" style={{ marginBottom:28 }}/>

      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:14, color:RED, letterSpacing:5, marginBottom:6 }}>
          {greeting().toUpperCase()}
        </div>
        <div style={{ fontFamily:"'Bebas Neue'", fontSize:52, color:WHITE, letterSpacing:4, lineHeight:1, animation:"fadeUp 0.6s ease 0.4s both" }}>
          {user.name.toUpperCase()}
        </div>
        <div style={{ fontFamily:"'DM Sans'", fontSize:13, color:"#555", marginTop:10, letterSpacing:1, animation:"fadeUp 0.6s ease 0.6s both" }}>
          {goalLabel[user.goal]} · Tenjiku awaits
        </div>
      </div>

      <button onClick={onContinue} style={{
        marginTop:44, background:RED, color:WHITE, border:"none",
        fontFamily:"'Bebas Neue'", fontSize:18, letterSpacing:4,
        padding:"16px 56px", cursor:"pointer",
        animation:"fadeUp 0.6s ease 0.8s both"
      }}>
        ENTER ›
      </button>

      {["天","代","横","浜"].map((k,i)=>(
        <div key={k} style={{ position:"absolute", fontFamily:"'Bebas Neue'", fontSize:22, color:RED, opacity:0.15,
          top:i<2?20:"auto", bottom:i>=2?20:"auto", left:i%2===0?20:"auto", right:i%2===1?20:"auto" }}>{k}</div>
      ))}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${BLACK},${RED})` }}/>
    </div>
  );
}

/* ── APP ROOT ────────────────────────────────────── */
export default function App() {
  const [session,   setSession]   = useState(()=>lsGet('im_session', null));
  const [user,      setUser]      = useState(()=>lsGet('im_user', null));
  const [welcomed,  setWelcomed]  = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [darkMode,  setDarkMode]  = useState(()=>{ const d=lsGet('im_darkMode',false); applyTheme(d); return d; });

  const toggleDarkMode = () => {
    setDarkMode(d => {
      const next = !d;
      applyTheme(next);
      lsSet('im_darkMode', next);
      return next;
    });
  };

  // On mount: check for OAuth redirect hash, then validate/restore session
  useEffect(() => {
    const fromHash = sbGetSessionFromHash();
    if (fromHash) {
      lsSet('im_session', fromHash);
      setSession(fromHash);
    }
    setAuthReady(true);
  }, []);

  // When session exists but token may be stale — refresh it silently
  useEffect(() => {
    if (!session?.refresh_token) return;
    const refresh = async () => {
      const res = await sbRefreshToken(session.refresh_token);
      if (res.access_token) {
        const updated = { access_token: res.access_token, refresh_token: res.refresh_token || session.refresh_token };
        lsSet('im_session', updated);
        setSession(updated);
      }
    };
    // Refresh every 50 minutes
    const interval = setInterval(refresh, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [session]);

  const handleAuth = async ({ session: newSession, name }) => {
    lsSet('im_session', newSession);
    setSession(newSession);
    setCloudLoading(true);

    // Try to load existing cloud data
    const userId = parseJwt(newSession.access_token)?.sub;
    if (userId) {
      const cloudData = await sbLoadData(newSession.access_token, userId);
      if (cloudData?.user_profile) {
        // Returning user — restore their data
        const p = cloudData.user_profile;
        lsSet('im_user', p);
        setUser(p);
        if (cloudData.food_log)      lsSet('im_foodLog',       cloudData.food_log);
        if (cloudData.sessions)      lsSet('im_sessions',      cloudData.sessions);
        if (cloudData.body_metrics)  lsSet('im_bodyMetrics',   cloudData.body_metrics);
        if (cloudData.sleep_log)     lsSet('im_sleepLog',      cloudData.sleep_log);
        if (cloudData.favorites)     lsSet('im_favorites',     cloudData.favorites);
        if (cloudData.profiles)      lsSet('oja_profiles',     cloudData.profiles);
        if (cloudData.cardio_log)    lsSet('im_cardioLog',     cloudData.cardio_log);
        if (cloudData.custom_workouts) lsSet('im_customWorkouts', cloudData.custom_workouts);
        setCloudLoading(false);
        setWelcomed(false); // show welcome back screen
        return;
      }
    }

    // New user — if name provided (from signup), pre-fill
    if (name) lsSet('im_pending_name', name);
    setCloudLoading(false);
  };

  const handleComplete = async (d) => {
    // Merge any pending name from Google/email signup
    const pendingName = lsGet('im_pending_name', null);
    const finalUser = pendingName ? { ...d, name: pendingName } : d;
    try { localStorage.removeItem('im_pending_name'); } catch {}

    lsSet('im_user', finalUser);
    if (finalUser.calcedGoals) lsSet('oja_goals', finalUser.calcedGoals);
    setUser(finalUser);
    setWelcomed(true);

    // Save to cloud if authenticated
    if (session) {
      const userId = parseJwt(session.access_token)?.sub;
      if (userId) sbUpsertData(session.access_token, userId, { user_profile: finalUser });
    }
  };

  if (!authReady) return null;

  if (cloudLoading) return (
    <div style={{ position:"fixed", inset:0, background:BLACK, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
      <YinYang size={60} className="spin-slow" style={{ marginBottom:20 }}/>
      <div style={{ fontFamily:"'Bebas Neue'", fontSize:16, color:WHITE, letterSpacing:3 }}>LOADING YOUR DATA...</div>
    </div>
  );

  return (
    <>
      <style>{ANIM}</style>
      {!session
        ? <AuthScreen onAuth={handleAuth}/>
        : !user
          ? <Onboarding onComplete={handleComplete}/>
          : !welcomed
            ? <WelcomeBack user={user} onContinue={()=>setWelcomed(true)}/>
            : <MainApp user={user} session={session} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} onSignOut={async()=>{
                await sbSignOut(session.access_token);
                const keys=['im_session','im_user','im_foodLog','im_favorites','im_sessions',
                  'im_bodyMetrics','im_sleepLog','im_customWorkouts','im_progressPhotos',
                  'im_waterLog','im_prevScore','oja_goals','oja_profiles','im_cardioLog'];
                keys.forEach(k=>{ try { localStorage.removeItem(k); } catch {} });
                setSession(null); setUser(null); setWelcomed(false);
              }}/>
      }
    </>
  );
}

// Decode JWT payload without a library
function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/');
    return JSON.parse(atob(base64));
  } catch { return null; }
}
