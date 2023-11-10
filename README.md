# Automatic deletion of uninteresting videos on YouTube
最近 YouTube AI によってやたらオススメされる興味ない動画を自動で削除する FireFox 向けのアドオンです。 具体的にはチャンネル登録されておらず、一定の再生回数に満たない動画を削除します。
 
# DEMO
赤丸で囲った興味ないと思われる動画を自動で非表示にします。

![Screenshot01](/image/screenshot01.jpg)

ブロックされたチャンネル名はアドオンのメニューから確認できます。

![Screenshot02](/image/screenshot02.jpg)
 
# Requirement
FireFox 118.0.2 で動作を確認

# Usage
1. アドオンを有効化し、YouTube (youtube.com) を開きます
2. サイドメニューの登録チャンネルから「他～件を表示」を押下します
3. アドオンのメニューを開き「Update from subscribed channel」を押下します

以上で基本設定が完了です。<br>
アドオンのメニューからブロックされている動画のチャンネル名が表示されます。<br>
もし意図しないチャンネルがブロックされている場合はチャンネル名左の「＋」ボタンを押下することで、ホワイトリストに登録できます。<br>
また、チャンネル名を自分で入力して「Manual add」を押下することでホワイトリストに登録することもできます。

# Note
**チャンネル登録されておらず、再生回数1000回以下の動画**がブロックされます。<br>
これは YouTube AI によってオススメされる全く興味ない動画が以上の条件に当てはまる傾向にあるためです。<br>
ブロックルールのカスタマイズ性は後のアップデートで向上させます。<br>

# Author
Cl2_CHINO