import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.io.OutputStream;
import java.io.File;
import java.nio.file.Files;
import java.net.InetSocketAddress;

public class App {
    public static void main(String[] args) throws Exception {
        int port = 8080;
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        
        server.createContext("/", new StaticFileHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("Servidor iniciado na porta " + port);
        System.out.println("Acesse: http://localhost:" + port);
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            String rootPath = "public";
            String path = t.getRequestURI().getPath();
            
            if (path.equals("/")) {
                path = "/index.html";
            }
            
            File file = new File(rootPath + path);
            System.out.println("Solicitando: " + file.getPath());

            if (!file.exists() || file.isDirectory()) {
                String response = "404 (Not Found)\n";
                t.sendResponseHeaders(404, response.length());
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
                return;
            }

            String mimeType = Files.probeContentType(file.toPath());
            if (mimeType == null) {
                if (path.endsWith(".css")) mimeType = "text/css";
                else if (path.endsWith(".js")) mimeType = "application/javascript";
                else mimeType = "application/octet-stream";
            }

            t.getResponseHeaders().set("Content-Type", mimeType);
            t.sendResponseHeaders(200, file.length());
            
            OutputStream os = t.getResponseBody();
            Files.copy(file.toPath(), os);
            os.close();
        }
    }
}
