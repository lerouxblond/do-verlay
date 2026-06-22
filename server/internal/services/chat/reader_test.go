package chat

import "testing"

func TestPingReply(t *testing.T) {
	if reply, ok := pingReply("PING :tmi.twitch.tv"); !ok || reply != "PONG :tmi.twitch.tv" {
		t.Fatalf("pingReply = %q, %v ; want \"PONG :tmi.twitch.tv\", true", reply, ok)
	}
	if _, ok := pingReply(":foo!foo@foo.tmi.twitch.tv PRIVMSG #bar :hi"); ok {
		t.Fatal("une ligne non-PING a été détectée comme PING")
	}
}

func TestCommandFromPrivmsg(t *testing.T) {
	cases := []struct {
		line string
		want string
		ok   bool
	}{
		{":foo!foo@foo.tmi.twitch.tv PRIVMSG #bar :!dofus go go", "!dofus", true},
		{":foo!foo@foo.tmi.twitch.tv PRIVMSG #bar :!GUILDE", "!guilde", true},
		{":foo!foo@foo.tmi.twitch.tv PRIVMSG #bar :coucou les amis", "", false},
		{":tmi.twitch.tv 001 justinfan42 :Welcome, GLHF!", "", false},
	}
	for _, c := range cases {
		got, ok := commandFromPrivmsg(c.line)
		if got != c.want || ok != c.ok {
			t.Errorf("commandFromPrivmsg(%q) = %q, %v ; want %q, %v", c.line, got, ok, c.want, c.ok)
		}
	}
}

func TestNormalizeChannel(t *testing.T) {
	if got := normalizeChannel("  #MonPseudo "); got != "monpseudo" {
		t.Fatalf("normalizeChannel = %q ; want \"monpseudo\"", got)
	}
}
