import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Modal,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ADMIN_EMAIL = 'linughost@gmail.com';

export default function App() {
  const [isDark, setIsDark] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authHandle, setAuthHandle] = useState('');

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('explore');
  const [activeTab, setActiveTab] = useState('Stream');
  const [screenParams, setScreenParams] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Gamification & Ticker
  const [points, setPoints] = useState(100);
  const [streak, setStreak] = useState(1);
  const [broadcast, setBroadcast] = useState(
    'AURA Network Initialized. Node ready for transmissions.'
  );

  // Dynamic One UI Theme
  const theme = {
    bg: isDark ? '#000000' : '#F3F5F9',
    card: isDark ? '#111114' : '#FFFFFF',
    alt: isDark ? '#1B1B21' : '#EAEEF6',
    textPrimary: isDark ? '#F5F4F8' : '#171020',
    textSecondary: isDark ? '#B5B2BF' : '#5A5866',
    primary: '#B89AFF',
    accent: '#A783FF',
    green: '#10B981',
    red: '#EF4444',
    border: isDark ? '#303039' : '#D1D5DB',
  };

  // Pure Empty State Collections
  const [posts, setPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [followedWaves, setFollowedWaves] = useState([]);
  const [messages, setMessages] = useState([]);
  const [memos, setMemos] = useState([]);
  const [bazaarItems, setBazaarItems] = useState([]);
  const [resonanceHistory, setResonanceHistory] = useState([]);

  const [selectedPostReaction, setSelectedPostReaction] = useState(null);

  // Admin Check
  const isAdmin =
    currentUser &&
    currentUser.email.trim().toLowerCase() ===
      ADMIN_EMAIL.toLowerCase();

  // Navigation Helpers
  const navigate = (screenName, params = {}) => {
    setScreenParams(params);
    if (screenName === 'Main') {
      if (params.screen) setActiveTab(params.screen);
      setCurrentScreen('main');
    } else {
      setCurrentScreen(screenName);
    }
  };

  const goBack = () => {
    if (
      [
        'compose',
        'detail',
        'chemistry',
        'memo',
        'broadcast',
        'stage',
        'account',
        'academy',
      ].includes(currentScreen)
    ) {
      setCurrentScreen('main');
    } else {
      setCurrentScreen('explore');
    }
  };

  const dateLabel = (dateStr) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString([], {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  // Auth Submit
  const handleAuth = () => {
    if (!authEmail.trim() || !authPass.trim()) {
      Alert.alert('Required', 'Please enter email and password.');
      return;
    }

    const cleanEmail = authEmail.trim();
    const isAdminUser =
      cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    let assignedHandle = authHandle.trim();
    if (!assignedHandle) {
      assignedHandle = isAdminUser
        ? '@Admin_Master'
        : `@Node_${Math.floor(100 + Math.random() * 900)}`;
    } else if (!assignedHandle.startsWith('@')) {
      assignedHandle = `@${assignedHandle}`;
    }

    setCurrentUser({
      email: cleanEmail,
      handle: assignedHandle,
      isAdmin: isAdminUser,
    });
    setAuthEmail('');
    setAuthPass('');
    setAuthHandle('');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setIsDrawerOpen(false);
  };

  // Shared Components
  const Shell = ({ title, back, actions, children }) => (
    <View style={[styles.root, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        {back ? (
          <TouchableOpacity onPress={goBack} style={styles.iconButton}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsDrawerOpen(true)}
            style={styles.iconButton}
          >
            <Ionicons name="menu" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        )}
        <Text
          style={[styles.title, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={styles.headerActions}>{actions}</View>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );

  const Card = ({ children, style }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
        style,
      ]}
    >
      {children}
    </View>
  );

  const Button = ({ label, icon, quiet, disabled, onPress, style }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: quiet ? theme.alt : theme.accent,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={quiet ? theme.textPrimary : '#171020'}
          style={{ marginRight: label ? 6 : 0 }}
        />
      )}
      {label && (
        <Text
          style={[
            styles.buttonText,
            { color: quiet ? theme.textPrimary : '#171020' },
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );

  // ====================================================
  // 1. AUTHENTICATION SCREEN (LOGIN / SIGN UP)
  // ====================================================
  if (!currentUser) {
    return (
      <SafeAreaView
        style={[styles.root, { backgroundColor: theme.bg }]}
      >
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={theme.bg}
        />
        <ScrollView
          contentContainerStyle={styles.authScroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.authHeaderBox}>
            <View
              style={[
                styles.authLogoSquircle,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Ionicons
                name="finger-print-outline"
                size={44}
                color={theme.accent}
              />
            </View>
            <Text
              style={[styles.authTitleText, { color: theme.textPrimary }]}
            >
              A U R A
            </Text>
            <Text
              style={[styles.authSubText, { color: theme.textSecondary }]}
            >
              Decentralized One UI Node
            </Text>
          </View>

          <Card style={{ marginVertical: 14 }}>
            <Text
              style={[styles.bold, { color: theme.textPrimary, marginBottom: 8 }]}
            >
              {authMode === 'login' ? 'Access Node' : 'Create Identity'}
            </Text>

            <TextInput
              placeholder="Email address"
              placeholderTextColor={theme.textSecondary}
              value={authEmail}
              onChangeText={setAuthEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={[
                styles.input,
                {
                  backgroundColor: theme.alt,
                  color: theme.textPrimary,
                  borderColor: theme.border,
                },
              ]}
            />

            <TextInput
              placeholder="Encrypted password"
              placeholderTextColor={theme.textSecondary}
              value={authPass}
              onChangeText={setAuthPass}
              secureTextEntry
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  backgroundColor: theme.alt,
                  color: theme.textPrimary,
                  borderColor: theme.border,
                },
              ]}
            />

            {authMode === 'signup' && (
              <TextInput
                placeholder="Choose handle (e.g. @MySignal)"
                placeholderTextColor={theme.textSecondary}
                value={authHandle}
                onChangeText={setAuthHandle}
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.alt,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  },
                ]}
              />
            )}

            <Button
              label={
                authMode === 'login'
                  ? 'Sign In to Network'
                  : 'Register Account'
              }
              icon="log-in-outline"
              onPress={handleAuth}
              style={{ marginTop: 6 }}
            />

            <Button
              quiet
              label={
                authMode === 'login'
                  ? 'Need an account? Register here'
                  : 'Already registered? Sign in'
              }
              onPress={() =>
                setAuthMode(authMode === 'login' ? 'signup' : 'login')
              }
              style={{ marginTop: 8 }}
            />
          </Card>

          <View style={styles.authNoticeBox}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={theme.green}
            />
            <Text
              style={[
                styles.secondary,
                { color: theme.textSecondary, marginLeft: 6 },
              ]}
            >
              Signing in as {ADMIN_EMAIL} unlocks Admin Master.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ====================================================
  // 2. EXPLORE SCREEN
  // ====================================================
  const NexusExploreScreen = () => {
    const [search, setSearch] = useState('');
    const filtered = posts.filter((p) =>
      p.body.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <Shell
        title="NEXUS"
        actions={
          <TouchableOpacity
            onPress={() => setIsDark(!isDark)}
            style={styles.iconButton}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={20}
              color={theme.primary}
            />
          </TouchableOpacity>
        }
      >
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Explore Community
        </Text>
        <View style={styles.buttonRow}>
          <Button
            quiet
            icon="home-outline"
            label="Hubs"
            onPress={() => navigate('Main', { screen: 'Stream' })}
            style={{ flex: 1, marginRight: 6 }}
          />
          <Button
            quiet
            icon="chatbubbles-outline"
            label="Messages"
            onPress={() => navigate('Main', { screen: 'Tribes' })}
            style={{ flex: 1, marginRight: 6 }}
          />
          <Button
            icon="school-outline"
            label="Academy"
            onPress={() => navigate('academy')}
            style={{ flex: 1 }}
          />
        </View>

        <Card style={{ marginVertical: 12 }}>
          <Ionicons
            name="images-outline"
            size={36}
            color={theme.primary}
          />
          <Text
            style={[styles.bold, { color: theme.textPrimary, marginTop: 6 }]}
          >
            Community Updates
          </Text>
          <Text
            style={[
              styles.secondary,
              { color: theme.textSecondary, marginVertical: 6 },
            ]}
          >
            Pure ecosystem online. Transmit the first signal.
          </Text>
          <Button
            label="Write a Transmission"
            icon="add"
            onPress={() => navigate('compose')}
          />
        </Card>

        <TextInput
          placeholder="Search transmissions..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.textPrimary,
              borderColor: theme.border,
            },
          ]}
        />

        {filtered.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: 20 }}>
            <Ionicons
              name="radio-outline"
              size={36}
              color={theme.textSecondary}
            />
            <Text
              style={[
                styles.secondary,
                { color: theme.textSecondary, marginTop: 6 },
              ]}
            >
              No transmissions found. Share your voice!
            </Text>
          </Card>
        ) : (
          filtered.map((row) => (
            <Card key={row.id}>
              <View style={styles.row}>
                <Ionicons
                  name="person-circle-outline"
                  size={38}
                  color={theme.primary}
                />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={[styles.bold, { color: theme.textPrimary }]}>
                    {row.handle}
                  </Text>
                  <Text
                    style={[
                      styles.secondary,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {dateLabel(row.created_at)}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.body,
                  { color: theme.textPrimary, marginVertical: 10 },
                ]}
              >
                {row.body}
              </Text>
              <View style={styles.row}>
                <Text
                  style={[
                    styles.secondary,
                    { color: theme.textSecondary, flex: 1 },
                  ]}
                >
                  {row.like_count || 0} likes
                </Text>
                <Button
                  quiet
                  icon="chatbubble-outline"
                  label="Reply"
                  onPress={() => navigate('compose', { replyTo: row.id })}
                />
              </View>
            </Card>
          ))
        )}
      </Shell>
    );
  };

  // ====================================================
  // 3. ACADEMY SCREEN
  // ====================================================
  const NexusAcademyScreen = () => {
    const [topic, setTopic] = useState('Study planning');
    const descriptions = {
      'Study planning':
        'Define a single learning intention. Break it down into 3 milestones and trigger a 25-minute focus session.',
      'Peer review':
        'Share your stem or project in Creators Hub. Request technical feedback.',
      'Project teamwork':
        'Align targets, divide components, and post updates so collaborators track velocity.',
    };

    return (
      <Shell title="NEXUS Academy" back>
        <Text style={[styles.secondary, { color: theme.textSecondary }]}>
          Decentralized skills and peer collaboration.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 12 }}
        >
          {['Study planning', 'Peer review', 'Project teamwork'].map(
            (name) => (
              <Button
                key={name}
                label={name}
                quiet={topic !== name}
                onPress={() => setTopic(name)}
                style={{ marginRight: 8 }}
              />
            )
          )}
        </ScrollView>

        <Card>
          <Ionicons name="book-outline" size={36} color={theme.primary} />
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.textPrimary, marginVertical: 6 },
            ]}
          >
            {topic}
          </Text>
          <Text style={[styles.body, { color: theme.textPrimary }]}>
            {descriptions[topic]}
          </Text>
        </Card>

        <Button
          icon="chatbubbles-outline"
          label="Open Tribes Messenger"
          onPress={() => navigate('Main', { screen: 'Tribes' })}
          style={{ marginVertical: 6 }}
        />
        <Button
          quiet
          icon="timer-outline"
          label="Open Focus Rhythm Timer"
          onPress={() => navigate('Main', { screen: 'Vault' })}
          style={{ marginVertical: 6 }}
        />
      </Shell>
    );
  };

  // ====================================================
  // 4. STREAM HUB
  // ====================================================
  const StreamHub = () => (
    <Shell
      title="Aura Stream"
      actions={
        <TouchableOpacity
          onPress={() => navigate('compose')}
          style={styles.iconButton}
        >
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={theme.primary}
          />
        </TouchableOpacity>
      }
    >
      {/* Waves Horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 14 }}
      >
        <TouchableOpacity
          style={styles.wave}
          onPress={() => navigate('compose')}
        >
          <View
            style={[
              styles.waveRing,
              { borderColor: theme.accent, backgroundColor: theme.alt },
            ]}
          >
            <Ionicons name="add" size={24} color={theme.primary} />
          </View>
          <Text
            style={[
              styles.secondary,
              { color: theme.textSecondary, marginTop: 4 },
            ]}
          >
            Your wave
          </Text>
        </TouchableOpacity>
        {followedWaves.map((w) => (
          <TouchableOpacity
            key={w.id}
            style={styles.wave}
            onPress={() => Alert.alert(w.handle, 'Wave signal')}
          >
            <View
              style={[
                styles.waveRing,
                { borderColor: theme.border, backgroundColor: theme.alt },
              ]}
            >
              <Text style={{ color: theme.textPrimary, fontWeight: '700' }}>
                {w.handle.charAt(1)}
              </Text>
            </View>
            <Text
              style={[
                styles.secondary,
                { color: theme.textSecondary, marginTop: 4 },
              ]}
              numberOfLines={1}
            >
              {w.handle}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Announcements */}
      {announcements.map((a) => (
        <Card
          key={a.id}
          style={{ borderColor: theme.primary, borderWidth: 1 }}
        >
          <Text style={[styles.bold, { color: theme.primary }]}>
            {a.handle} · Global Broadcast
          </Text>
          <Text
            style={[styles.body, { color: theme.textPrimary, marginTop: 4 }]}
          >
            {a.body}
          </Text>
        </Card>
      ))}

      {/* Posts */}
      {posts.length === 0 ? (
        <Card style={{ alignItems: 'center', padding: 24 }}>
          <Ionicons
            name="infinite-outline"
            size={40}
            color={theme.textSecondary}
          />
          <Text
            style={[
              styles.bold,
              { color: theme.textPrimary, marginVertical: 6 },
            ]}
          >
            The Stream is Quiet
          </Text>
          <Text
            style={[
              styles.secondary,
              { color: theme.textSecondary, textAlign: 'center' },
            ]}
          >
            You are in pure node state. Transmit the first post or stem to the network!
          </Text>
          <Button
            label="Transmit Signal"
            icon="create-outline"
            onPress={() => navigate('compose')}
            style={{ marginTop: 12 }}
          />
        </Card>
      ) : (
        posts.map((row) => (
          <Card key={row.id}>
            <View style={styles.row}>
              <View
                style={[styles.avatar, { backgroundColor: theme.alt }]}
              >
                <Text
                  style={{ color: theme.textPrimary, fontWeight: '700' }}
                >
                  {row.handle.charAt(1)}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={[styles.bold, { color: theme.textPrimary }]}>
                  {row.handle}
                </Text>
                <Text
                  style={[
                    styles.secondary,
                    { color: theme.textSecondary },
                  ]}
                >
                  {dateLabel(row.created_at)}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.body,
                { color: theme.textPrimary, marginVertical: 10 },
              ]}
            >
              {row.body}
            </Text>

            <View style={styles.row}>
              <Button
                quiet
                icon={row.liked ? 'heart' : 'heart-outline'}
                label={String(row.like_count || 0)}
                onPress={() => {
                  setPosts(
                    posts.map((p) =>
                      p.id === row.id
                        ? {
                            ...p,
                            liked: !p.liked,
                            like_count: p.liked
                              ? p.like_count - 1
                              : p.like_count + 1,
                          }
                        : p
                    )
                  );
                }}
                style={{ marginRight: 8 }}
              />
              <Button
                quiet
                icon="chatbubble-outline"
                label="Reply"
                onPress={() => navigate('compose', { replyTo: row.id })}
                style={{ marginRight: 8 }}
              />
              <Button
                quiet
                icon="share-outline"
                onPress={() => Share.share({ message: row.body })}
              />
            </View>

            {/* Sticker Counts */}
            <View
              style={[
                styles.row,
                {
                  borderTopWidth: 1,
                  borderTopColor: theme.border,
                  paddingTop: 10,
                  marginTop: 8,
                },
              ]}
            >
              <Button
                quiet
                icon="flash-outline"
                label={`Aura ${row.sticker_counts?.Aura || 0}`}
                onPress={() => {
                  setPosts(
                    posts.map((p) =>
                      p.id === row.id
                        ? {
                            ...p,
                            sticker_counts: {
                              ...p.sticker_counts,
                              Aura:
                                (p.sticker_counts?.Aura || 0) + 1,
                            },
                          }
                        : p
                    )
                  );
                }}
                style={{ marginRight: 8 }}
              />
              <Button
                label="React"
                quiet
                icon="add"
                onPress={() => setSelectedPostReaction(row)}
              />
            </View>
          </Card>
        ))
      )}

      {/* Reaction Sheet Modal */}
      <Modal
        visible={!!selectedPostReaction}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.reactionSheet, { backgroundColor: theme.card }]}
          >
            <Text
              style={[
                styles.bold,
                {
                  color: theme.textPrimary,
                  fontSize: 18,
                  marginBottom: 12,
                },
              ]}
            >
              React to {selectedPostReaction?.handle}
            </Text>
            {['Aura', 'Shield', 'Fire', 'Gem', 'Orbit'].map((name) => (
              <Button
                key={name}
                quiet
                label={`${name} · ${
                  selectedPostReaction?.sticker_counts?.[name] || 0
                }`}
                onPress={() => {
                  if (selectedPostReaction) {
                    setPosts(
                      posts.map((p) =>
                        p.id === selectedPostReaction.id
                          ? {
                              ...p,
                              sticker_counts: {
                                ...p.sticker_counts,
                                [name]:
                                  (p.sticker_counts?.[name] || 0) + 1,
                              },
                            }
                          : p
                      )
                    );
                  }
                  setSelectedPostReaction(null);
                }}
                style={{ marginVertical: 4 }}
              />
            ))}
            <Button
              label="Dismiss"
              quiet
              onPress={() => setSelectedPostReaction(null)}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </Modal>
    </Shell>
  );

  // ====================================================
  // 5. TRIBES MESSENGER
  // ====================================================
  const TribesMessenger = () => {
    const [channel, setChannel] = useState('Creators Hub');
    const [inputBody, setInputBody] = useState('');
    const channelMessages = messages.filter((m) => m.channel === channel);

    const sendMessage = () => {
      if (!inputBody.trim()) return;
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          channel,
          handle: currentUser.handle,
          body: inputBody.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setInputBody('');
    };

    return (
      <Shell
        title="Tribes"
        actions={
          <TouchableOpacity
            onPress={() => navigate('stage')}
            style={styles.iconButton}
          >
            <Ionicons
              name="headset-outline"
              size={22}
              color={theme.primary}
            />
          </TouchableOpacity>
        }
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          {['Creators Hub', 'Code & Cyber', 'Music & Sounds'].map(
            (name) => (
              <Button
                key={name}
                label={'#' + name}
                quiet={channel !== name}
                onPress={() => setChannel(name)}
                style={{ marginRight: 8 }}
              />
            )
          )}
        </ScrollView>
        <Text style={[styles.secondary, { color: theme.primary, marginBottom: 12 }]}>
          🔒 End-to-end device transmission
        </Text>

        {channelMessages.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: 20 }}>
            <Ionicons
              name="chatbubbles-outline"
              size={36}
              color={theme.textSecondary}
            />
            <Text
              style={[
                styles.secondary,
                { color: theme.textSecondary, marginTop: 6 },
              ]}
            >
              No messages in #{channel} yet. Say hello!
            </Text>
          </Card>
        ) : (
          channelMessages.map((m) => (
            <Card
              key={m.id}
              style={{
                maxWidth: '85%',
                alignSelf:
                  m.handle === currentUser.handle
                    ? 'flex-end'
                    : 'flex-start',
              }}
            >
              <Text style={[styles.secondary, { color: theme.accent }]}>
                {m.handle}
              </Text>
              <Text
                style={[
                  styles.body,
                  { color: theme.textPrimary, marginVertical: 4 },
                ]}
              >
                {m.body}
              </Text>
              <Text
                style={[
                  styles.secondary,
                  { color: theme.textSecondary, alignSelf: 'flex-end' },
                ]}
              >
                {dateLabel(m.created_at)}
              </Text>
            </Card>
          ))
        )}

        <Card style={{ marginTop: 12 }}>
          <TextInput
            placeholder={`Message #${channel}...`}
            placeholderTextColor={theme.textSecondary}
            value={inputBody}
            onChangeText={setInputBody}
            style={[
              styles.input,
              {
                backgroundColor: theme.alt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />
          <Button
            label="Transmit"
            icon="send-outline"
            onPress={sendMessage}
            disabled={!inputBody.trim()}
          />
        </Card>
      </Shell>
    );
  };

  // ====================================================
  // 6. CREATIVE BAZAAR
  // ====================================================
  const CreativeBazaar = () => {
    const [cat, setCat] = useState('Stems');
    const filtered = bazaarItems.filter((i) => i.category === cat);

    return (
      <Shell title="Bazaar">
        <Text style={[styles.secondary, { color: theme.primary }]}>
          CREATIVE EXCHANGE
        </Text>
        <Text
          style={[
            styles.bold,
            { color: theme.textPrimary, fontSize: 20, marginBottom: 12 },
          ]}
        >
          Peer Stems, Assets & Skills
        </Text>
        <View style={styles.buttonRow}>
          {['Stems', 'Skills', 'UI Kits'].map((name) => (
            <Button
              key={name}
              label={name}
              quiet={cat !== name}
              onPress={() => setCat(name)}
              style={{ flex: 1, marginRight: 6 }}
            />
          ))}
        </View>

        {filtered.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: 24, marginTop: 12 }}>
            <Ionicons
              name="bag-outline"
              size={36}
              color={theme.textSecondary}
            />
            <Text
              style={[
                styles.bold,
                { color: theme.textPrimary, marginTop: 8 },
              ]}
            >
              No {cat} listed yet
            </Text>
            <Text
              style={[
                styles.secondary,
                { color: theme.textSecondary, textAlign: 'center', marginTop: 4 },
              ]}
            >
              List your audio stems, code, or offer a skill swap session!
            </Text>
            <Button
              label="Offer a Listing"
              icon="add"
              onPress={() => {
                const title = prompt ? prompt('Title:') : 'New Asset';
                if (title) {
                  setBazaarItems([
                    {
                      id: Date.now().toString(),
                      title,
                      category: cat,
                      handle: currentUser.handle,
                      details: 'Community exchange offer.',
                      meta: '1 node',
                    },
                    ...bazaarItems,
                  ]);
                }
              }}
              style={{ marginTop: 12 }}
            />
          </Card>
        ) : (
          filtered.map((r) => (
            <Card key={r.id} style={{ marginVertical: 6 }}>
              <Text style={[styles.bold, { color: theme.textPrimary }]}>
                {r.title}
              </Text>
              <Text style={[styles.secondary, { color: theme.accent }]}>
                {r.category} · {r.meta}
              </Text>
              <Text
                style={[
                  styles.body,
                  { color: theme.textPrimary, marginVertical: 8 },
                ]}
              >
                {r.details}
              </Text>
              <Button
                quiet
                label="View Listing"
                icon="arrow-forward"
                onPress={() => navigate('detail', { item: r })}
              />
            </Card>
          ))
        )}
      </Shell>
    );
  };

  // ====================================================
  // 7. ARENA CIPHERS
  // ====================================================
  const ArenaCiphers = () => {
    const [votes, setVotes] = useState({ yes: 0, no: 0, userChoice: null });
    const [reveal, setReveal] = useState(false);
    const [phraseIdx, setPhraseIdx] = useState(0);

    const PHRASES = [
      {
        phrase: 'Hold the line',
        tag: 'Code & Cyber',
        definition:
          'Stay steady under pressure; maintain node integrity when signals get noisy.',
      },
      {
        phrase: 'Less gear, more ears',
        tag: 'Music & Sounds',
        definition:
          'Attentive listening matters far more than accumulating equipment.',
      },
      {
        phrase: 'Ship the spark',
        tag: 'Creators Hub',
        definition:
          'Deliver the first functioning version instead of hesitating for perfection.',
      },
    ];

    const totalVotes = votes.yes + votes.no;
    const yesPct =
      totalVotes > 0 ? Math.round((votes.yes / totalVotes) * 100) : 50;
    const noPct =
      totalVotes > 0 ? Math.round((votes.no / totalVotes) * 100) : 50;

    return (
      <Shell title="Arena">
        <Card>
          <Text style={[styles.secondary, { color: theme.primary }]}>
            STREET CLASH · LOCAL POLL
          </Text>
          <Text
            style={[
              styles.bold,
              { color: theme.textPrimary, marginVertical: 6 },
            ]}
          >
            Should AI tracks be credited as co-creators?
          </Text>

          <Button
            label={`Yes — instruments shape output (${yesPct}%)`}
            quiet={votes.userChoice !== 'yes'}
            onPress={() =>
              setVotes({
                ...votes,
                yes: votes.yes + (votes.userChoice === 'yes' ? 0 : 1),
                userChoice: 'yes',
              })
            }
            style={{ marginVertical: 4 }}
          />
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${yesPct}%`, backgroundColor: theme.accent },
              ]}
            />
          </View>

          <Button
            label={`No — human consciousness owns work (${noPct}%)`}
            quiet={votes.userChoice !== 'no'}
            onPress={() =>
              setVotes({
                ...votes,
                no: votes.no + (votes.userChoice === 'no' ? 0 : 1),
                userChoice: 'no',
              })
            }
            style={{ marginVertical: 4 }}
          />
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${noPct}%`, backgroundColor: theme.primary },
              ]}
            />
          </View>
          <Text
            style={[
              styles.secondary,
              { color: theme.textSecondary, marginTop: 4 },
            ]}
          >
            {totalVotes} votes cast locally
          </Text>
        </Card>

        {/* Proverb Decoder */}
        <Card style={{ marginVertical: 8 }}>
          <Text style={[styles.secondary, { color: theme.primary }]}>
            ANCIENT PROVERB CIPHER
          </Text>
          <Text
            style={[
              styles.bold,
              { color: theme.textPrimary, marginVertical: 6 },
            ]}
          >
            “The quiet river cuts the deepest stone.”
          </Text>
          <Text
            style={[
              styles.body,
              { color: theme.textPrimary, marginVertical: 6 },
            ]}
          >
            {reveal
              ? 'Decoded Truth: Relentless gentle pressure conquers sheer brute force.'
              : 'Truth veiled in allegory'}
          </Text>
          <Button
            label={reveal ? 'Hide Truth' : 'Reveal Truth'}
            icon="eye-outline"
            onPress={() => setReveal(!reveal)}
          />
        </Card>

        {/* Street Slang */}
        <Card>
          <Text style={[styles.secondary, { color: theme.primary }]}>
            STREET PHRASE · {phraseIdx + 1} OF {PHRASES.length}
          </Text>
          <Text
            style={[
              styles.title,
              { color: theme.textPrimary, marginVertical: 4 },
            ]}
          >
            {PHRASES[phraseIdx].phrase}
          </Text>
          <Text style={[styles.secondary, { color: theme.accent }]}>
            {PHRASES[phraseIdx].tag}
          </Text>
          <Text
            style={[
              styles.body,
              { color: theme.textPrimary, marginVertical: 8 },
            ]}
          >
            {PHRASES[phraseIdx].definition}
          </Text>
          <Button
            quiet
            label="Next Phrase"
            icon="refresh"
            onPress={() =>
              setPhraseIdx((phraseIdx + 1) % PHRASES.length)
            }
          />
        </Card>
      </Shell>
    );
  };

  // ====================================================
  // 8. PRIVATE VAULT
  // ====================================================
  const PrivateVault = () => {
    const [seconds, setSeconds] = useState(1500);
    const [running, setRunning] = useState(false);

    useEffect(() => {
      let interval = null;
      if (running && seconds > 0) {
        interval = setInterval(() => setSeconds((s) => s - 1), 1000);
      } else if (seconds === 0) {
        setRunning(false);
      }
      return () => clearInterval(interval);
    }, [running, seconds]);

    const formatTimer = () => {
      const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    };

    return (
      <Shell
        title="Vault"
        actions={
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => navigate('chemistry')}
              style={[styles.iconButton, { marginRight: 6 }]}
            >
              <Ionicons
                name="sparkles-outline"
                size={22}
                color={theme.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate('memo')}
              style={styles.iconButton}
            >
              <Ionicons name="add" size={24} color={theme.primary} />
            </TouchableOpacity>
          </View>
        }
      >
        <Card style={{ alignItems: 'center', padding: 20 }}>
          <Text style={[styles.secondary, { color: theme.primary }]}>
            DEEP FOCUS RHYTHM
          </Text>
          <Text style={[styles.timer, { color: theme.textPrimary }]}>
            {formatTimer()}
          </Text>
          <View style={[styles.track, { width: '100%' }]}>
            <View
              style={[
                styles.fill,
                {
                  width: `${((1500 - seconds) / 1500) * 100}%`,
                  backgroundColor: theme.accent,
                },
              ]}
            />
          </View>
          <Button
            label={running ? 'Pause Focus' : 'Start Focus Session'}
            icon={running ? 'pause' : 'play'}
            onPress={() => setRunning(!running)}
            style={{ marginTop: 10 }}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Private Encrypted Memos
        </Text>
        {memos.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: 20 }}>
            <Ionicons
              name="lock-closed-outline"
              size={36}
              color={theme.textSecondary}
            />
            <Text
              style={[
                styles.secondary,
                { color: theme.textSecondary, marginTop: 6 },
              ]}
            >
              Your scratchpad is empty. Keep an idea close!
            </Text>
            <Button
              label="Create Memo"
              icon="add"
              onPress={() => navigate('memo')}
              style={{ marginTop: 10 }}
            />
          </Card>
        ) : (
          memos.map((m) => (
            <Card key={m.id}>
              <TouchableOpacity
                onPress={() => navigate('memo', { memoId: m.id })}
              >
                <Text style={[styles.bold, { color: theme.textPrimary }]}>
                  {m.body.split('\n')[0]}
                </Text>
                <Text
                  style={[
                    styles.secondary,
                    { color: theme.textSecondary, marginTop: 4 },
                  ]}
                >
                  {dateLabel(m.created_at)}
                </Text>
              </TouchableOpacity>
            </Card>
          ))
        )}
      </Shell>
    );
  };

  // ====================================================
  // 9. STACK SCREENS (COMPOSE, DETAIL, CHEMISTRY, MEMO, BROADCAST, STAGE)
  // ====================================================
  const ComposePostScreen = () => {
    const [body, setBody] = useState('');
    const replyTo = screenParams?.replyTo;

    const handleSave = () => {
      if (!body.trim()) return;
      if (replyTo) {
        Alert.alert('Transmitted', 'Your reply signal was registered.');
      } else {
        setPosts([
          {
            id: Date.now().toString(),
            handle: currentUser.handle,
            body: body.trim(),
            created_at: new Date().toISOString(),
            like_count: 0,
            liked: false,
            sticker_counts: {},
          },
          ...posts,
        ]);
      }
      goBack();
    };

    return (
      <Shell title={replyTo ? 'Reply' : 'New Transmission'} back>
        <Card>
          <Text style={[styles.bold, { color: theme.primary }]}>
            {currentUser.handle}
          </Text>
          <TextInput
            placeholder="Share thought, stem or frequency..."
            placeholderTextColor={theme.textSecondary}
            value={body}
            onChangeText={setBody}
            multiline
            style={[
              styles.input,
              {
                minHeight: 180,
                backgroundColor: theme.alt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />
          <Button
            label="Broadcast Transmission"
            icon="send"
            onPress={handleSave}
            disabled={!body.trim()}
          />
        </Card>
      </Shell>
    );
  };

  const ChemistryCalculatorScreen = () => {
    const [first, setFirst] = useState(currentUser.handle);
    const [second, setSecond] = useState('@Pulse_88');

    const handleCalc = () => {
      const score = Math.floor(Math.random() * 40) + 60;
      setResonanceHistory([
        {
          id: Date.now().toString(),
          first,
          second,
          score,
          created_at: new Date().toISOString(),
        },
        ...resonanceHistory,
      ]);
    };

    return (
      <Shell title="Chemistry" back>
        <Card>
          <Text
            style={[
              styles.bold,
              { color: theme.textPrimary, marginBottom: 8 },
            ]}
          >
            Signal Resonance Matrix
          </Text>
          <TextInput
            value={first}
            onChangeText={setFirst}
            placeholder="First handle"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: theme.alt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />
          <TextInput
            value={second}
            onChangeText={setSecond}
            placeholder="Second handle"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: theme.alt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />
          <Button
            label="Calculate Resonance"
            icon="flash-outline"
            onPress={handleCalc}
          />
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Resonance Log
        </Text>
        {resonanceHistory.map((rh) => (
          <Card key={rh.id}>
            <Text style={[styles.bold, { color: theme.accent }]}>
              {rh.first} + {rh.second}
            </Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {rh.score}%
            </Text>
            <Text
              style={[
                styles.secondary,
                { color: theme.textSecondary },
              ]}
            >
              {dateLabel(rh.created_at)}
            </Text>
          </Card>
        ))}
      </Shell>
    );
  };

  const MemoEditorScreen = () => {
    const [memoBody, setMemoBody] = useState('');
    return (
      <Shell title="Edit Memo" back>
        <Card>
          <TextInput
            placeholder="Keep an idea close to device storage..."
            placeholderTextColor={theme.textSecondary}
            value={memoBody}
            onChangeText={setMemoBody}
            multiline
            style={[
              styles.input,
              {
                minHeight: 260,
                backgroundColor: theme.alt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />
          <Button
            label="Store Memo"
            icon="save-outline"
            onPress={() => {
              if (memoBody.trim()) {
                setMemos([
                  {
                    id: Date.now().toString(),
                    body: memoBody.trim(),
                    created_at: new Date().toISOString(),
                  },
                  ...memos,
                ]);
              }
              goBack();
            }}
          />
        </Card>
      </Shell>
    );
  };

  // ADMIN ONLY SCREEN
  const AdminBroadcastScreen = () => {
    const [announcementText, setAnnouncementText] = useState('');

    if (!isAdmin) {
      return (
        <Shell title="Restricted" back>
          <Card style={{ alignItems: 'center', padding: 20 }}>
            <Ionicons name="lock-closed" size={40} color={theme.red} />
            <Text style={[styles.bold, { color: theme.red, marginTop: 8 }]}>
              Access Prohibited
            </Text>
            <Text
              style={[
                styles.secondary,
                { color: theme.textSecondary, marginTop: 4 },
              ]}
            >
              Only {ADMIN_EMAIL} can access the Admin Console.
            </Text>
          </Card>
        </Shell>
      );
    }

    return (
      <Shell title="Admin Console" back>
        <Card>
          <Text style={[styles.bold, { color: theme.primary }]}>
            SYSTEM MASTER CONSOLE · {ADMIN_EMAIL}
          </Text>
          <TextInput
            placeholder="Broadcast system announcement to network..."
            placeholderTextColor={theme.textSecondary}
            value={announcementText}
            onChangeText={setAnnouncementText}
            multiline
            style={[
              styles.input,
              {
                minHeight: 140,
                backgroundColor: theme.alt,
                color: theme.textPrimary,
                borderColor: theme.border,
              },
            ]}
          />
          <Button
            label="Broadcast Live"
            icon="megaphone-outline"
            onPress={() => {
              if (announcementText.trim()) {
                setAnnouncements([
                  {
                    id: Date.now().toString(),
                    handle: '@Admin_Master',
                    body: announcementText.trim(),
                  },
                  ...announcements,
                ]);
                Alert.alert('Signal Active', 'Broadcast is live.');
                goBack();
              }
            }}
          />
        </Card>
      </Shell>
    );
  };

  const AudioStageScreen = () => {
    const [muted, setMuted] = useState(false);
    return (
      <Shell title="Audio Stage Demo" back>
        <Card style={{ alignItems: 'center', padding: 24 }}>
          <View
            style={[
              styles.waveRing,
              {
                width: 90,
                height: 90,
                borderColor: theme.accent,
                backgroundColor: theme.alt,
              },
            ]}
          >
            <Ionicons
              name="headset-outline"
              size={44}
              color={theme.primary}
            />
          </View>
          <Text
            style={[
              styles.bold,
              {
                color: theme.textPrimary,
                fontSize: 18,
                marginTop: 12,
              },
            ]}
          >
            Stage Node #3 · Simulated
          </Text>
          <Text
            style={[styles.secondary, { color: theme.textSecondary }]}
          >
            Active Node User: {currentUser.handle}
          </Text>
        </Card>

        <View style={styles.buttonRow}>
          <Button
            quiet
            icon={muted ? 'mic-off' : 'mic'}
            label={muted ? 'Unmute' : 'Mute'}
            onPress={() => setMuted(!muted)}
            style={{ flex: 1, marginRight: 6 }}
          />
          <Button
            label="Disconnect"
            icon="call-outline"
            onPress={goBack}
            style={{ flex: 1 }}
          />
        </View>
      </Shell>
    );
  };

  // ====================================================
  // ROUTER CONTROLLER
  // ====================================================
  const renderCurrentView = () => {
    if (currentScreen === 'explore') return <NexusExploreScreen />;
    if (currentScreen === 'academy') return <NexusAcademyScreen />;
    if (currentScreen === 'compose') return <ComposePostScreen />;
    if (currentScreen === 'chemistry') return <ChemistryCalculatorScreen />;
    if (currentScreen === 'memo') return <MemoEditorScreen />;
    if (currentScreen === 'broadcast') return <AdminBroadcastScreen />;
    if (currentScreen === 'stage') return <AudioStageScreen />;
    if (currentScreen === 'detail') {
      const itm = screenParams?.item || {};
      return (
        <Shell title="Listing" back>
          <Card>
            <Text style={[styles.bold, { color: theme.primary }]}>
              {itm.category}
            </Text>
            <Text
              style={[
                styles.title,
                { color: theme.textPrimary, marginVertical: 6 },
              ]}
            >
              {itm.title}
            </Text>
            <Text
              style={[styles.secondary, { color: theme.textSecondary }]}
            >
              {itm.handle} · {itm.meta}
            </Text>
            <Text
              style={[
                styles.body,
                { color: theme.textPrimary, marginVertical: 14 },
              ]}
            >
              {itm.details}
            </Text>
            <Button
              label="Discuss in Tribes"
              icon="chatbubbles-outline"
              onPress={() =>
                navigate('Main', { screen: 'Tribes' })
              }
            />
          </Card>
        </Shell>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {activeTab === 'Stream' && <StreamHub />}
        {activeTab === 'Tribes' && <TribesMessenger />}
        {activeTab === 'Bazaar' && <CreativeBazaar />}
        {activeTab === 'Arena' && <ArenaCiphers />}
        {activeTab === 'Vault' && <PrivateVault />}

        {/* ONE UI BOTTOM TASKBAR */}
        <View
          style={[
            styles.bottomBar,
            { backgroundColor: theme.card, borderTopColor: theme.border },
          ]}
        >
          {[
            {
              key: 'Stream',
              icon: 'home-outline',
              activeIcon: 'home',
            },
            {
              key: 'Tribes',
              icon: 'chatbubble-outline',
              activeIcon: 'chatbubble',
            },
            {
              key: 'Bazaar',
              icon: 'bag-outline',
              activeIcon: 'bag',
            },
            {
              key: 'Arena',
              icon: 'flame-outline',
              activeIcon: 'flame',
            },
            {
              key: 'Vault',
              icon: 'lock-closed-outline',
              activeIcon: 'lock-closed',
            },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={styles.navItem}
              onPress={() => setActiveTab(tab.key)}
            >
              <Ionicons
                name={
                  activeTab === tab.key ? tab.activeIcon : tab.icon
                }
                size={22}
                color={
                  activeTab === tab.key
                    ? theme.primary
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.navLabel,
                  {
                    color:
                      activeTab === tab.key
                        ? theme.primary
                        : theme.textSecondary,
                  },
                ]}
              >
                {tab.key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]}>
      {renderCurrentView()}

      {/* ONE UI SLIDE-OUT DRAWER MENU */}
      <Modal visible={isDrawerOpen} transparent animationType="fade">
        <View style={styles.drawerBackdrop}>
          <View
            style={[styles.drawerCard, { backgroundColor: theme.card }]}
          >
            <View style={styles.drawerProfileSection}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: isAdmin ? theme.red : theme.accent,
                    width: 44,
                    height: 44,
                    borderRadius: 16,
                  },
                ]}
              >
                <Text
                  style={{ color: '#FFF', fontWeight: '900', fontSize: 18 }}
                >
                  {currentUser.handle.charAt(1)}
                </Text>
              </View>
              <Text
                style={[
                  styles.bold,
                  {
                    color: theme.textPrimary,
                    fontSize: 17,
                    marginTop: 8,
                  },
                ]}
              >
                {currentUser.handle}
              </Text>
              <Text
                style={[
                  styles.secondary,
                  { color: theme.textSecondary, marginBottom: 6 },
                ]}
              >
                {currentUser.email}
              </Text>

              {/* ONLY SHOWN ON YOUR ADMIN ACCOUNT */}
              {isAdmin && (
                <View style={styles.adminStatusPill}>
                  <Ionicons
                    name="shield-checkmark"
                    size={13}
                    color="#10B981"
                  />
                  <Text style={styles.adminStatusText}>
                    SYSTEM MASTER (ADMIN)
                  </Text>
                </View>
              )}
            </View>

            <Button
              quiet
              label={
                isDark ? 'Clean White mode' : 'AMOLED Dark mode'
              }
              icon="contrast-outline"
              onPress={() => setIsDark(!isDark)}
              style={{ marginVertical: 6 }}
            />

            {/* ADMIN BROADCAST - ONLY ACCESSIBLE IF ADMIN */}
            {isAdmin && (
              <Button
                quiet
                label="Admin Broadcast Console"
                icon="megaphone-outline"
                onPress={() => {
                  setIsDrawerOpen(false);
                  navigate('broadcast');
                }}
                style={{ marginVertical: 6 }}
              />
            )}

            <Button
              quiet
              label="Live Audio Stage Demo"
              icon="headset-outline"
              onPress={() => {
                setIsDrawerOpen(false);
                navigate('stage');
              }}
              style={{ marginVertical: 6 }}
            />

            <Button
              quiet
              label="Log Out of Node"
              icon="log-out-outline"
              onPress={handleSignOut}
              style={{ marginTop: 'auto', marginBottom: 6 }}
            />

            <Button
              quiet
              label="Close Menu"
              icon="close"
              onPress={() => setIsDrawerOpen(false)}
            />
          </View>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setIsDrawerOpen(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerActions: { flexDirection: 'row', marginLeft: 'auto' },
  iconButton: { padding: 6 },
  title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginVertical: 10 },
  bold: { fontSize: 15, fontWeight: '700' },
  body: { fontSize: 14, lineHeight: 20 },
  secondary: { fontSize: 12 },
  scrollContent: { padding: 16, paddingBottom: 85 },
  card: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  buttonRow: { flexDirection: 'row', marginVertical: 6 },
  button: {
    minHeight: 44,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 14, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginVertical: 6,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: { width: 68, marginRight: 10, alignItems: 'center' },
  waveRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333333',
    overflow: 'hidden',
    marginVertical: 8,
  },
  fill: { height: 6, borderRadius: 3 },
  timer: { fontSize: 44, fontWeight: '800', marginVertical: 8 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  reactionSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  drawerBackdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  drawerCard: { width: '78%', height: '100%', padding: 22 },
  drawerProfileSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#303039',
    paddingBottom: 16,
    marginBottom: 14,
  },
  adminStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  adminStatusText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 4,
  },
  authScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  authHeaderBox: {
    alignItems: 'center',
    marginBottom: 10,
  },
  authLogoSquircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  authTitleText: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 6,
  },
  authSubText: {
    fontSize: 12,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  authNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
});