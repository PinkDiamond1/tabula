import { Chip, CircularProgress, Divider, Grid, Typography } from "@mui/material"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import { usePublicationContext } from "../../../services/publications/contexts"
import useArticle from "../../../services/publications/hooks/useArticle"
import { palette, typography } from "../../../theme"
import { Markdown } from "../../commons/Markdown"
import { ViewContainer } from "../../commons/ViewContainer"
import PublicationPage from "../../layout/PublicationPage"
import isIPFS from "is-ipfs"
import { WalletBadge } from "../../commons/WalletBadge"
import { chainNameToChainId } from "../../../constants/chain"

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

interface ArticleViewProps {
  updateChainId: (chainId: number) => void
}

export const ArticleView: React.FC<ArticleViewProps> = ({ updateChainId }) => {
  const { articleId, network } = useParams<{ articleId: string; network: string }>()
  const { publicationId } = useParams<{ publicationId: string }>()
  const { article, saveArticle, getPinnedData, markdownArticle, setMarkdownArticle, loading } = usePublicationContext()
  const { data, executeQuery } = useArticle(articleId || "")
  const date = article && article.lastUpdated && new Date(parseInt(article.lastUpdated) * 1000)
  const isValidHash = article && isIPFS.multihash(article.article)
  const [articleToShow, setArticleToShow] = useState<string>("")

  useEffect(() => {
    if (publicationId != null) {
      updateChainId(chainNameToChainId(network))
    }
  }, [publicationId, updateChainId, network])

  useEffect(() => {
    if (!article && articleId) {
      executeQuery()
    }
  }, [articleId, article, executeQuery])

  useEffect(() => {
    if (!article && data) {
      saveArticle(data)
    }
  }, [data, article, saveArticle])

  useEffect(() => {
    if (article) {
      if (isValidHash && article && !markdownArticle) {
        getPinnedData(article.article)
        return
      }
      if (!isValidHash && article) {
        setArticleToShow(article.article)
      }
    }
  }, [isValidHash, article, markdownArticle, getPinnedData])

  useEffect(() => {
    if (markdownArticle) {
      setArticleToShow(markdownArticle)
    }
  }, [markdownArticle])

  useEffect(() => {
    return () => {
      setMarkdownArticle(undefined)
    }
  }, [setMarkdownArticle])

  return (
    <PublicationPage showCreatePost={false} publication={article?.publication}>
      {loading ? (
        <Grid container justifyContent="center" alignItems="center" my={2}>
          <CircularProgress color="primary" size={50} sx={{ marginRight: 1, color: palette.primary[1000] }} />
        </Grid>
      ) : (
        <ViewContainer maxWidth="sm">
          {article && (
            <Grid container mt={10} flexDirection="column">
              <Helmet>
                <title>
                  {article.title} | {article.publication?.title}
                </title>
                <meta property="og:title" content={article.title} />
                <meta property="og:site_name" content={article.publication?.title} />
                {article?.description != null && [
                  <meta property="og:description" content={article?.description} key="1" />,
                  <meta name="description" content={article?.description} key="2" />,
                ]}
                <meta property="og:url" content={`https://tabula.gg/#/${article.publication?.id}/${article.id}`} />
                {article.image != null && <meta property="og:image" content={`${IPFS_GATEWAY}/${article?.image}`} />}
              </Helmet>
              {article.image && <img src={`${IPFS_GATEWAY}/${article?.image}`} alt={article.title} />}
              <Grid item>
                <Typography variant="h1" fontFamily={typography.fontFamilies.sans}>
                  {article.title}
                </Typography>
              </Grid>

              {article.authors?.length && (
                <Grid container alignItems="center" gap={2} my={1}>
                  {article.authors.map((author) => (
                    <Grid item>
                      <WalletBadge address={author} />
                    </Grid>
                  ))}
                </Grid>
              )}
              {article.publication && (
                <Grid container spacing={1} sx={{ marginLeft: -0.5 }}>
                  {article.tags &&
                    article.tags.length > 0 &&
                    article.tags.map((tag, index) => (
                      <Grid item>
                        <Chip sx={{ height: "100%" }} label={tag} size="small" key={index} />
                      </Grid>
                    ))}
                </Grid>
              )}
              <Grid item my={5} width="100%">
                <Markdown>{articleToShow}</Markdown>
              </Grid>

              <Divider />

              <Grid item mt={2}>
                <Typography variant="body1" fontFamily={typography.fontFamilies.sans}>
                  Article was updated on: {moment(date).format("MMMM DD, YYYY")}
                </Typography>
              </Grid>
            </Grid>
          )}
        </ViewContainer>
      )}
    </PublicationPage>
  )
}
