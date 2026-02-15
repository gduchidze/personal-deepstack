import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { BookOpen, ArrowLeft, FileText, Calendar } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

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
          <ArrowLeft color={colors.primary} size={20} />
          <Text style={styles.backButtonText}>უკან</Text>
        </TouchableOpacity>

        <View style={styles.articleHeader}>
          <Text style={styles.articleCategory}>{selectedArticle.category}</Text>
          <Text style={styles.articleTitle}>{selectedArticle.title}</Text>
          <View style={styles.articleMeta}>
            <Calendar color={colors.textSecondary} size={14} />
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
        <BookOpen color={colors.orange} size={24} />
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
              <FileText color={colors.blue} size={24} />
            </View>
            <View style={styles.articleInfo}>
              <Text style={styles.articleCardCategory}>{article.category}</Text>
              <Text style={styles.articleCardTitle}>{article.title}</Text>
              <View style={styles.articleCardMeta}>
                <Calendar color={colors.textSecondary} size={12} />
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
    fontFamily: typography.fontFamily,
    fontSize: 24,
    color: colors.orange,
    marginLeft: 12,
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 25,
  },
  articlesList: {
    gap: 15,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  articleIcon: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  articleInfo: {
    flex: 1,
  },
  articleCardCategory: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.blue,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  articleCardTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 20,
  },
  articleCardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleCardDate: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.textSecondary,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  articleHeader: {
    marginBottom: 20,
  },
  articleCategory: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.blue,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  articleTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: 10,
    lineHeight: 28,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleDate: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
  },
  articleContent: {
    flex: 1,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
  },
  footerSubtext: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.textSecondary,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  heading1: {
    fontFamily: typography.fontFamily,
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  heading2: {
    fontFamily: typography.fontFamily,
    color: colors.blue,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 12,
  },
  heading3: {
    fontFamily: typography.fontFamily,
    color: colors.orange,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: typography.fontFamily,
    color: colors.textBody,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  listItem: {
    fontFamily: typography.fontFamily,
    color: colors.textBody,
    fontSize: 14,
    lineHeight: 22,
  },
  code_inline: {
    fontFamily: typography.fontFamily,
    backgroundColor: colors.surfaceLighter,
    color: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    fontFamily: typography.fontFamily,
    backgroundColor: colors.surface,
    color: colors.primary,
    padding: 15,
    borderRadius: borderRadius.md,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fence: {
    fontFamily: typography.fontFamily,
    backgroundColor: colors.surface,
    color: colors.primary,
    padding: 15,
    borderRadius: borderRadius.md,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  blockquote: {
    fontFamily: typography.fontFamily,
    backgroundColor: colors.surfaceLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
    paddingLeft: 15,
    paddingVertical: 10,
    marginVertical: 10,
    fontStyle: 'italic',
    color: '#aaaaaa',
  },
  link: {
    color: colors.blue,
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 20,
  },
  strong: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  em: {
    fontStyle: 'italic',
    color: colors.textBody,
  },
});
