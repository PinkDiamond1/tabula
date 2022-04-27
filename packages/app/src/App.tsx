import React from "react"
import { Routes, Route } from "react-router-dom"
import { SnackbarProvider } from "notistack"
import { Provider as UrqlProvider } from "urql"
/** Views **/
import { LandingView } from "./components/views/home/LandingView"
import { PostView } from "./components/views/publishers/PostView"
import { PublishersView } from "./components/views/publishers/PublishersView"
import { WalletView } from "./components/views/wallet/WalletView"
import { PublishView } from "./components/views/publication/PublishView"
import { PublicationPostView } from "./components/views/publication/PublicationPostView"
import { PublicationProvider } from "./services/publications/contexts"
import { CreatePostView } from "./components/views/publication/CreatePostView"
import { PreviewPostView } from "./components/views/publication/PreviewPostView"
import { ArticleView } from "./components/views/publication/ArticleView"
import ScrollToTop from "./components/commons/ScrollToTop"
import { subgraphClient } from "./services/graphql"
import { PermissionView } from "./components/views/publication/PermissionView"
import SetupIpfsView from "./components/views/pinning/SetupIpfsView"

const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <UrqlProvider value={subgraphClient}>
        <PublicationProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingView />} />
            <Route path="/wallet" element={<WalletView />} />
            <Route path="/pinning" element={<SetupIpfsView />} />
            <Route path="/publication/publish" element={<PublishView />} />
            <Route path="/publication/post-action/:type" element={<CreatePostView />} />
            <Route path="/publication/preview-post/:type" element={<PreviewPostView />} />
            <Route path="/publication/:publicationId" element={<PublicationPostView />} />
            <Route path="/publication/:publicationId/article/:articleId" element={<ArticleView />} />
            <Route path="/publication/permission/:type" element={<PermissionView />} />

            {/** TO  REMOVE **/}
            <Route path=":address" element={<PublishersView />} />
            <Route path=":address/:postId" element={<PostView />} />
          </Routes>
        </PublicationProvider>
      </UrqlProvider>
    </SnackbarProvider>
  )
}

export default App
