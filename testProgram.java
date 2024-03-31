import org.htmlparser.util.ParserException;
import java.io.IOException;


public class testProgram {

    public static String testURL = "https://www.cse.ust.hk/~kwtleung/COMP4321/testpage.htm";

    public static String database = "mongodb+srv://chhuiwork:COMP4321haha@cluster0.mncnodn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


    public static void main(String[] args) {
        Crawler crawler;
        try {

            //Perform crawling + indexer with the crawler
            crawler = new Crawler(testURL, 30);
            crawler.extractLinks();
        } catch (ParserException | IOException e) {
            e.printStackTrace();
        }
    }
}