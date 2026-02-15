import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { BookOpen, ArrowLeft, FileText, Calendar } from 'lucide-react-native';

// Import markdown files as strings
const articles = {
  'week1-reflection': require('../../assets/articles/week1-reflection.md'),
  'ai-learning-journey': require('../../assets/articles/ai-learning-journey.md'),
  'dsa-strategies': require('../../assets/articles/dsa-strategies.md'),
};

interface Article {
  id: string;
  title: string;
  date: string;
  category: string;
  content: any;
}

const articlesList: Article[] = [
  {
    id: 'ai-learning-journey',
    title: 'ჩემი AI ინჟინერად გახდომის მოგზაურობა',
    date: 'Feb 16, 2026',
    category: 'Journey',
    content: articles['ai-learning-journey'],
  },
  {
    id: 'week1-reflection',
    title: 'კვირა 1: micrograd და ნეირონული ქსელების საფუძვლები',
    date: 'Feb 16, 2026',
    category: 'Weekly Reflection',
    content: articles['week1-reflection'],
  },
  {
    id: 'dsa-strategies',
    title: 'DSA პრობლემების გადაჭრის სტრატეგიები',
    date: 'Feb 16, 2026',
    category: 'DSA',
    content: articles['dsa-strategies'],
  },
];

export const ArticlesViewer: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [content, setContent] = useState<string>('');

  const loadArticle = async (article: Article) => {
    try {
      const response = await fetch(article.content);
      const text = await response.text();
      setContent(text);
      setSelectedArticle(article);
    } catch (error) {
      console.error('Error loading article:', error);
      setContent('# Error\n\nFailed to load article content.');
      setSelectedArticle(article);
    }
  };

  if (selectedArticle) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            setSelectedArticle(null);
            setContent('');
          }}
          activeOpacity={0.7}
        >
          <ArrowLeft color="#00ff41" size={20} />
          <Text style={styles.backButtonText}>უკან</Text>
        </TouchableOpacity>

        <View style={styles.articleHeader}>
          <Text style={styles.articleCategory}>{selectedArticle.category}</Text>
          <Text style={styles.articleTitle}>{selectedArticle.title}</Text>
          <View style={styles.articleMeta}>
            <Calendar color="#888" size={14} />
            <Text style={styles.articleDate}>{selectedArticle.date}</Text>
          </View>
        </View>

        <ScrollView style={styles.articleContent} showsVerticalScrollIndicator={false}>
          <Markdown style={markdownStyles}>
            {content}
          </Markdown>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BookOpen color="#ffa500" size={24} />
        <Text style={styles.title}>ჩემი სტატიები</Text>
      </View>

      <Text style={styles.subtitle}>
        პერსონალური ბლოგი AI/ML სწავლის მოგზაურობაზე
      </Text>

      <View style={styles.articlesList}>
        {articlesList.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => loadArticle(article)}
            activeOpacity={0.7}
          >
            <View style={styles.articleIcon}>
              <FileText color="#00bfff" size={24} />
            </View>
            <View style={styles.articleInfo}>
              <Text style={styles.articleCardCategory}>{article.category}</Text>
              <Text style={styles.articleCardTitle}>{article.title}</Text>
              <View style={styles.articleCardMeta}>
                <Calendar color="#888" size={12} />
                <Text style={styles.articleCardDate}>{article.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          📝 სულ {articlesList.length} სტატია
        </Text>
        <Text style={styles.footerSubtext}>
          რეგულარულად ემატება ახალი შინაარსი
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 24,
    color: '#ffa500',
    marginLeft: 12,
  },
  subtitle: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#888',
    marginBottom: 25,
  },
  articlesList: {
    gap: 15,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  articleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  articleInfo: {
    flex: 1,
  },
  articleCardCategory: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#00bfff',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  articleCardTitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 20,
  },
  articleCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleCardDate: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#888',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff41',
    marginLeft: 8,
  },
  articleHeader: {
    marginBottom: 20,
  },
  articleCategory: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#00bfff',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  articleTitle: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 10,
    lineHeight: 28,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleDate: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#888',
  },
  articleContent: {
    flex: 1,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff41',
    marginBottom: 5,
  },
  footerSubtext: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#888',
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontFamily: 'monospace',
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 22,
  },
  heading1: {
    fontFamily: 'monospace',
    color: '#00ff41',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  heading2: {
    fontFamily: 'monospace',
    color: '#00bfff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 12,
  },
  heading3: {
    fontFamily: 'monospace',
    color: '#ffa500',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: 'monospace',
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  listItem: {
    fontFamily: 'monospace',
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 22,
  },
  code_inline: {
    fontFamily: 'monospace',
    backgroundColor: '#1a1a1a',
    color: '#00ff41',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    fontFamily: 'monospace',
    backgroundColor: '#0a0a0a',
    color: '#00ff41',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  fence: {
    fontFamily: 'monospace',
    backgroundColor: '#0a0a0a',
    color: '#00ff41',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  blockquote: {
    fontFamily: 'monospace',
    backgroundColor: '#0f0f0f',
    borderLeftWidth: 4,
    borderLeftColor: '#00bfff',
    paddingLeft: 15,
    paddingVertical: 10,
    marginVertical: 10,
    fontStyle: 'italic',
    color: '#aaaaaa',
  },
  link: {
    color: '#00bfff',
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: '#1a1a1a',
    height: 1,
    marginVertical: 20,
  },
  strong: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  em: {
    fontStyle: 'italic',
    color: '#cccccc',
  },
});
