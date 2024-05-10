import org.htmlparser.util.ParserException;
import java.io.IOException;


public class testProgram {

    public static String testURL = "https://www.cse.ust.hk/~kwtleung/COMP4321/testpage.htm";

    public static String database = "mongodb://localhost:27017";


    public static void main(String[] args) {
        Crawler crawler;
        try {

            //Perform crawling + indexer with the crawler
            crawler = new Crawler(testURL, 300);
            crawler.extractLinks();
        } catch (ParserException | IOException e) {
            e.printStackTrace();
        }
    }
}